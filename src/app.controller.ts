import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './auth/decorators/is-public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiInfoDTO } from './dto/api-info.dto';

@ApiBearerAuth('token')
@ApiTags('API Test')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Test the API.' })
  @ApiResponse({
    status: 200,
    description: 'The API is up and running.',
    type: ApiInfoDTO,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  testApi(): object {
    return this.appService.testApi();
  }
}
