import { signMessage } from "./node-support";

export type BinanceBaseUrlKey =
    | 'spot'
    | 'spot1'
    | 'spot2'
    | 'spot3'
    | 'spot4'
    | 'usdmtest'
    | 'usdm'
    | 'coinm'
    | 'coinmtest'
    | 'voptions'
    | 'voptionstest';

export interface RestClientOptions {
    api_key?: string;

    api_secret?: string;

    // override the max size of the request window (in ms)
    recvWindow?: number;

    // how often to sync time drift with binance servers
    syncIntervalMs?: number | string;

    // Default: false. Disable above sync mechanism if true.
    disableTimeSync?: boolean;

    // Default: false. If true, we'll throw errors if any params are undefined
    strictParamValidation?: boolean;

    // Optionally override API protocol + domain
    // e.g 'https://api2.binance.com'
    baseUrl?: string;

    // manually override with one of the known base URLs in the library
    baseUrlKey?: BinanceBaseUrlKey,

    // Default: true. whether to try and post-process request exceptions.
    parseExceptions?: boolean;

    // Default: false, if true will try to resolve known strings containing numbers to "number" type
    beautifyResponses?: boolean;
}

export type GenericAPIResponse<T = any> = Promise<T>;

export async function getRequestSignature(
    data: any,
    key?: string,
    secret?: string,
    recvWindow?: number,
    timestamp?: number,
    strictParamValidation?: boolean,
): Promise<SignedRequestState> {
    // Optional, set to 5000 by default. Increase if timestamp/recvWindow errors are seen.
    const requestRecvWindow = data?.recvWindow ?? recvWindow ?? 5000;

    if (key && secret) {
        const requestParams = {
            ...data,
            timestamp,
            recvWindow: requestRecvWindow
        }
        const serialisedParams = serialiseParams(requestParams, strictParamValidation, true);
        const signature = await signMessage(serialisedParams, secret);
        requestParams.signature = signature;

        return {
            requestBody: { ...data },
            serialisedParams,
            timestamp: timestamp,
            signature: signature,
            recvWindow: requestRecvWindow,
        }
    }

    return { requestBody: data, serialisedParams: undefined };
}

export function serialiseParams(params: object = {}, strict_validation = false, encodeValues: boolean = false): string {
    return Object.keys(params)
        .map(key => {
            const value = params[key];
            if (strict_validation === true && typeof value === 'undefined') {
                throw new Error('Failed to sign API request due to undefined parameter');
            }
            const encodedValue = encodeValues ? encodeURIComponent(value) : value;
            return `${key}=${encodedValue}`;
        })
        .join('&');
};

export interface SignedRequestState {
    // Request body as an object, as originally provided by caller
    requestBody: any;
    // Params serialised into a query string, including timestamp and revvwindow
    serialisedParams: string | undefined;
    timestamp?: number;
    signature?: string;
    recvWindow?: number;
}