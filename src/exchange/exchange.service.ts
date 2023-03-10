import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { Setting } from 'src/settings/entities/setting.entity';
import { UsersService } from 'src/users/users.service';
import Axios from 'src/utils/axios';
// import { getPublic } from 'src/utils/axios';
import { Logger } from 'winston';
import { MainClient } from 'binance';

@Injectable()
export class ExchangeService extends Axios {
    @Inject() private userService: UsersService
    @Inject('winston') private logger: Logger




    async exchangeInfo(settings: Setting) {
        const client = new MainClient({
            api_key: settings.accessKey,
            api_secret: settings.secretKey,
            baseUrl: settings.apiUrl
        });
        return client
            .getExchangeInfo()
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.error('getExchangeInfo inverse error: ', err);
            });
    }

    async getFullBalance(fiat: string, id: number) {
        try {
            const info = await this.loadBalance(id, fiat);

            //     const averages = await ordersRepository.getAveragePrices();
            //     const symbols = await symbolsRepository.getManySymbols(averages.map(a => a.symbol));

            //     let symbolsObj = {};
            //     for (let i = 0; i < symbols.length; i++) {
            //         const symbol = symbols[i];
            //         symbolsObj[symbol.symbol] = { base: symbol.base, quote: symbol.quote };
            //     }

            //     const grouped = {};
            //     for (let i = 0; i < averages.length; i++) {
            //         const averageObj = averages[i];
            //         const symbol = symbolsObj[averageObj.symbol];

            //         if (symbol.quote !== fiat) {
            //             averageObj.avg = beholder.tryFiatConversion(symbol.quote, parseFloat(averageObj.avg), fiat);
            //             averageObj.net = beholder.tryFiatConversion(symbol.quote, parseFloat(averageObj.net), fiat);
            //         }

            //         averageObj.symbol = symbol.base;

            //         if (!grouped[symbol.base]) grouped[symbol.base] = { net: 0, qty: 0 };
            //         grouped[symbol.base].net += averageObj.net;
            //         grouped[symbol.base].qty += averageObj.qty;
            //     }

            //     const coins = [...new Set(averages.map(a => a.symbol))];
            //     coins.map(coin => info[coin].avg = grouped[coin].net / grouped[coin].qty);

            //     res.json(info);
        } catch (err) {
            this.logger.info(err.message);
            return new BadRequestException(err.message);
        }
    }

    async loadBalance(settingsId: number, fiat: string) {
        const { apiUrl, accessKey, secretKey } = await this.userService.getSettings(settingsId);
        const info = await this.getPrivate(`${apiUrl}/v1/capital/config/getall`, { accessKey, secretKey });

        // const coins = Object.entries(info).map(p => p[0]);

        // let total = 0;
        // await Promise.all(coins.map(async (coin) => {
        //     let available = parseFloat(info[coin].available);
        //     if (available > 0) available = beholder.tryFiatConversion(coin, available, fiat);

        //     let onOrder = parseFloat(info[coin].onOrder);
        //     if (onOrder > 0) onOrder = beholder.tryFiatConversion(coin, onOrder, fiat);

        //     info[coin].fiatEstimate = available + onOrder;
        //     total += available + onOrder;
        // }))

        // info.fiatEstimate = `~${fiat} ${total.toFixed(2)}`;
        // return info;
    }

}