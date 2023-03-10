import { Injectable } from '@nestjs/common';
import { Setting } from 'src/settings/entities/setting.entity';
import { getPublicRequest } from 'src/utils/axios';

@Injectable()
export class ExchangeService {
    
    async exchangeInfo(settings: Setting) {
        const url = settings.apiUrl
        const request = await getPublicRequest(url)
        return request
    }

}