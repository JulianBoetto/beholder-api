import { ForbiddenException } from "@nestjs/common";
import { catchError, lastValueFrom, map } from "rxjs";
import { HttpService } from '@nestjs/axios';

const http = new HttpService();
export const getPublicRequest = async (url: string) => {
    const request = http.get(`${url}/v3/exchangeInfo`)
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