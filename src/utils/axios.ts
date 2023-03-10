import { HttpService } from '@nestjs/axios';
import {
    BinanceBaseUrlKey,
    serialiseParams,
    RestClientOptions,
    GenericAPIResponse,
    // getRestBaseUrl,
    getRequestSignature,
} from './requestUtils';
import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import Beautifier from './beautifier';
import { UsersService } from "src/users/users.service";

type ApiLimitHeader =
    | 'x-mbx-used-weight'
    | 'x-mbx-used-weight-1m'
    | 'x-sapi-used-ip-weight-1m'
    | 'x-mbx-order-count-1s'
    | 'x-mbx-order-count-1m'
    | 'x-mbx-order-count-1h'
    | 'x-mbx-order-count-1d';

export default abstract class Axios {
    private timeOffset: number = 0;
    private syncTimePromise: null | Promise<void>;
    private options: RestClientOptions;
    private baseUrl: string;
    private globalRequestOptions: AxiosRequestConfig;
    private key: string | undefined;
    private secret: string | undefined;
    private baseUrlKey: BinanceBaseUrlKey;
    private beautifier: Beautifier | undefined;

    public apiLimitTrackers: Record<ApiLimitHeader, number>;
    public apiLimitLastUpdated: number;

    constructor(
        userService: UsersService,
        // baseUrlKey: BinanceBaseUrlKey,
        options: RestClientOptions = {},
        // requestOptions: AxiosRequestConfig = {}
    ) {
        this.options = {
            recvWindow: 5000,
            // how often to sync time drift with binance servers
            syncIntervalMs: 3600000,
            // if true, we'll throw errors if any params are undefined
            strictParamValidation: false,
            // disable the time sync mechanism by default
            disableTimeSync: true,
            ...options,
        };
    }

    public async getPublic(endpoint: string, params?: any) {
        return this._call('GET', endpoint, params);
    }

    public async getPrivate(endpoint: string, params?: any) {
        return await this._call("GET", endpoint, params, true);
    }

    public async _call(
        method: Method,
        endpoint: string,
        params?: any,
        isPrivate?: boolean,
        baseUrlOverride?: string
    ): GenericAPIResponse {
        const timestamp = Date.now() + (this.getTimeOffset() || 0);

        if (isPrivate && (!this.key || !this.secret)) {
            throw new Error(
                'Private endpoints require api and private keys to be set'
            );
        }

        // Handles serialisation of params into query string (url?key1=value1&key2=value2), handles encoding of values, adds timestamp and signature to request.
        const { serialisedParams, signature, requestBody } =
            await getRequestSignature(
                params,
                this.key,
                this.secret,
                this.options.recvWindow,
                timestamp,
                this.options.strictParamValidation
            );

        const baseUrl = baseUrlOverride || this.baseUrl;

        const options = {
            ...this.globalRequestOptions,
            url: baseUrl ? [baseUrl, endpoint].join('/'): endpoint,
            method: method,
            json: true,
        };

        if (isPrivate) {
            options.url +=
                '?' + [serialisedParams, 'signature=' + signature].join('&');
        } else if (method === 'GET' || method === 'DELETE') {
            options.params = params;
        } else {
            options.data = serialiseParams(
                requestBody,
                this.options.strictParamValidation,
                true
            );
        }

        return axios(options)
            .then((response) => {
                this.updateApiLimitState(response.headers, options.url);
                if (response.status == 200) {
                    return response.data;
                }

                throw response;
            })
            .then((response) => {
                if (!this.options.beautifyResponses || !this.beautifier) {
                    return response;
                }

                // Fallback to original response if beautifier fails
                try {
                    return this.beautifier.beautify(response, endpoint) || response;
                } catch (e) {
                    console.error(
                        'BaseRestClient response beautify failed: ',
                        JSON.stringify({ response: response, error: e })
                    );
                }
                return response;
            })
            .catch((e) => this.parseException(e, options.url));
    }

    public getTimeOffset(): number {
        return this.timeOffset;
    }

    private parseException(e: AxiosError, url: string): unknown {
        const { response, request, message } = e;

        if (response && response.headers) {
            this.updateApiLimitState(response.headers, url);
        }

        if (this.options.parseExceptions === false) {
            throw e;
        }

        // Something happened in setting up the request that triggered an Error
        if (!response) {
            if (!request) {
                throw message;
            }

            // request made but no response received
            throw e;
        }

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw {
            // code: response.data?.code,
            // message: response.data?.msg,
            body: response.data,
            headers: response.headers,
            requestUrl: url,
            requestBody: request.body,
            requestOptions: {
                ...this.options,
                api_key: undefined,
                api_secret: undefined,
            },
        };
    }

    private updateApiLimitState(
        responseHeaders: Record<string, any>,
        requestedUrl: string
    ) {
        const delta: Record<string, any> = {};
        for (const headerKey in this.apiLimitTrackers) {
            const headerValue = responseHeaders[headerKey];
            const value = parseInt(headerValue);
            if (headerValue !== undefined && !isNaN(value)) {
                // TODO: track last seen by key? insetad of all? some keys not returned by some endpoints more useful in estimating whether reset should've happened
                this.apiLimitTrackers[headerKey] = value;
                delta[headerKey] = {
                    updated: true,
                    valueParsed: value,
                    valueRaw: headerValue,
                };
            } else {
                delta[headerKey] = {
                    updated: false,
                    valueParsed: value,
                    valueRaw: headerValue,
                };
            }
        }
        // console.log('responseHeaders: ', requestedUrl);
        // console.table(responseHeaders);
        // console.table(delta);
        this.apiLimitLastUpdated = new Date().getTime();
    }


}