import { Controller, Get, HttpCode, HttpStatus, Param, Request } from '@nestjs/common';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
    constructor(private readonly exchangeService: ExchangeService) { }

    @Get('balance/full/:fiat')
    findBalance(@Param("fiat") fiat: string, @Request() req: AuthRequest) {
        const userId: number = req.user['userId'];
        return this.exchangeService.getFullBalance(fiat, userId);
    }


    // get('/balance/full/:fiat', exchangeController.getFullBalance);

    // get('/balance/:fiat', getBalance);

    // get('/coins', getCoins);

    // post('/withdraw/:id', doWithdraw);
}
