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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @ApiOperation({ summary: 'Obtener balance completo' })
  @ApiParam({ name: 'fiat', description: 'Moneda fiat', required: true })
  @ApiResponse({ status: 200, description: 'Balance completo', type: Object })
  @Get('balance/full/:fiat')
  findFullBalance(@Param('fiat') fiat: string, @Request() req: AuthRequest) {
    const userId: number = req.user['userId'];
    return this.exchangeService.getFullBalance(fiat, userId);
  }
  @ApiOperation({ summary: 'Obtener balance' })
  @ApiParam({ name: 'fiat', description: 'Moneda fiat', required: true })
  @ApiResponse({ status: 200, description: 'Balance', type: Object })
  @Get('balance/:fiat')
  findBalance(@Param('fiat') fiat: string, @Request() req: AuthRequest) {
    const userId: number = req.user['userId'];
    return this.exchangeService.getBalance(fiat, userId);
  }

  @ApiOperation({ summary: 'Obtener lista de monedas' })
  @ApiResponse({ status: 200, description: 'Lista de monedas', type: [String] })
  @Get('coins')
  getCoins(@Request() req: AuthRequest): any {
    const userId: number = req.user['userId'];
    return this.exchangeService.getCoins(userId);
  }
}
