import { Controller, Get, HttpCode, HttpStatus, Param, Request } from '@nestjs/common';
import { AuthRequest } from '../auth/models/AuthRequest';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
    constructor(private readonly exchangeService: ExchangeService) { }

    @Get('balance/full/:fiat')
    findFullBalance(@Param("fiat") fiat: string, @Request() req: AuthRequest) {
        const userId: number = req.user['userId'];
        return this.exchangeService.getFullBalance(fiat, userId);
    }

    @Get('balance/:fiat')
    findBalance(@Param("fiat") fiat: string, @Request() req: AuthRequest) {
        const userId: number = req.user['userId'];
        return this.exchangeService.getBalance(fiat, userId);
    }


    // get('/coins', getCoins);

    // post('/withdraw/:id', doWithdraw);
}
