import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthRequest } from '../auth/models/AuthRequest';
import { ExchangeService } from './exchange.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('token')
@ApiTags('Exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @ApiOperation({ summary: 'Get a complete balance by fiat currency' })
  @ApiParam({ name: 'fiat', description: 'Fiat currency', required: true })
  @ApiResponse({ status: 200, description: 'Complete balance.', type: Object })
  @Get('balance/full/:fiat')
  findFullBalance(@Param('fiat') fiat: string, @Request() req: AuthRequest) {
    const userId: number = req.user['userId'];
    return this.exchangeService.getFullBalance(fiat, userId);
  }

  @ApiOperation({ summary: 'Get balance by fiat currency.' })
  @ApiParam({ name: 'fiat', description: 'Fiat currency', required: true })
  @ApiResponse({ status: 200, description: 'Balance', type: Object })
  @Get('balance/:fiat')
  findBalance(@Param('fiat') fiat: string, @Request() req: AuthRequest) {
    const userId: number = req.user['userId'];
    return this.exchangeService.getBalance(fiat, userId);
  }

  @ApiOperation({ summary: 'Get list of coins.' })
  @ApiResponse({ status: 200, description: 'List of coins', type: [String] })
  @Get('coins')
  getCoins(@Request() req: AuthRequest): any {
    const userId: number = req.user['userId'];
    return this.exchangeService.getCoins(userId);
  }
}
