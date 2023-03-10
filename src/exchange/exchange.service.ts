import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Setting } from 'src/settings/entities/setting.entity';

@Injectable()
export class ExchangeService {
    constructor(private http: HttpService) { }

    async exchangeInfo(settings: Setting) {
        const url = settings.apiUrl
        const request = this.http.get(`${url}/v3/exchangeInfo`)
            .pipe(map((res) => {
                return res.data
            }))
            .pipe(
                catchError(() => {
                    throw new ForbiddenException('API not available');
                }),
            );

        const info = await lastValueFrom(request);

        return info
    }

}
