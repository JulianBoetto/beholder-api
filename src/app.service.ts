import { Injectable } from '@nestjs/common';
import { ApiInfoDTO } from './dto/api-info.dto';

@Injectable()
export class AppService {  
  async testApi(): Promise<ApiInfoDTO> {
    return {
      name: "Beholder-API",
      version: "1.0",
      date: 2023,
      author: "Julián Boetto"
    };
  }
}
