import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './auth/decorators/is-public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('API Test')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @IsPublic()
  @Get()
  testApi(): object {
    return this.appService.testApi();
  }
}
