import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {  
  async testApi(): Promise<object> {
    return {
      name: "Beholder-API",
      version: "1.0",
      date: 2023,
      author: "Julián Boetto"
    };
  }
}
