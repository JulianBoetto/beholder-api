import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ExchangeInfo,
  KlinesParams,
  MainClient,
  NewSpotOrderParams,
  SpotOrder,
} from 'binance';
import { Setting } from '../settings/entities/setting.entity';
import { SettingsService } from '../settings/settings.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { tryFiatConversion } from '../utils/fiatConversion';
import { toKlineInterval } from '../utils/types/klineIntervalTypes';
import { toOrderType } from '../utils/types/orderTypes';
import { BinanceWS } from '../utils/webSocket';
import { Logger } from 'winston';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly usersService: UsersService,
    private readonly settingsService: SettingsService,
  ) {}
  @Inject('winston') private logger: Logger;

  private client(settings: Setting) {
    const client = new MainClient({
      api_key: settings.accessKey,
      api_secret: settings.secretKey,
      baseUrl: settings.apiUrl,
      recvWindow: 6000,
    });
    return client;
  }

  async exchangeInfo(settings: Setting) {
    const result: ExchangeInfo = await this.client(settings).getExchangeInfo();
    if(!result) {
      // this.logger.info(`getExchangeInfo error: ${err.body ? err.body : err}`);      
    }
    return result;
  }

  async orderBuy(
    settings: User,
    symbol: string,
    quantity: string,
    limitPrice: string,
    options: { type: string; quoteOrderQty: string },
  ) {
    const params: NewSpotOrderParams = {
      symbol,
      side: 'BUY',
      type: toOrderType(options.type),
    };

    quantity
      ? (params.quantity = parseFloat(quantity))
      : (params.quoteOrderQty = parseFloat(options.quoteOrderQty));

    return await this.client(settings).submitNewOrder(params); // testNewOrder(params);
  }

  async orderSell(
    settings: User,
    symbol: string,
    quantity: string,
    limitPrice: string,
    options: { type: string; quoteOrderQty: string },
  ) {
    const params: NewSpotOrderParams = {
      symbol,
      side: 'SELL',
      type: toOrderType(options.type),
    };

    quantity
      ? (params.quantity = parseFloat(quantity))
      : (params.quoteOrderQty = parseFloat(options.quoteOrderQty));

    return await this.client(settings).submitNewOrder(params); // submitNewOrder(params);
  }

  async getBalance(fiat: string, id: number) {
    //   try {
    //     const info = await this.loadBalance(id, fiat);
    //     return info;
    //   } catch (err) {
    //     console.error(err.response ? err.response.data : err);
    //     // res.status(500).send(err.response ? err.response.data : err);
    //   }
  }

  async getFullBalance(fiat: string, id: number) {
    try {
      // const info = await this.loadBalance(id, fiat);
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
      // return info;
    } catch (err) {
      this.logger.info(err.message);
      return new BadRequestException(err.message);
    }
  }

  async getCoins(id: number) {
    const settings = await this.settingsService.getSettingsDecrypted(id);
    const coins = await this.client(settings)
      .getBalances()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        this.logger.info(`getExchangeInfo error: ${err.body ? err.body : err}`);
      });
    return coins;
  }

  async loadBalance(settings: Setting, fiat: string) {
    const info: any = await this.balance(settings);

    const coins = info.balances;

    let total = 0;
    await Promise.all(
      coins.map(async (coin: any, index: number) => {
        let available = parseFloat(info.balances[index].free);

        if (available > 0)
          available = tryFiatConversion(coin.asset, available, fiat);

        let onOrder = parseFloat(info.balances[index].locked);
        if (onOrder > 0) onOrder = tryFiatConversion(coin, onOrder, fiat);

        info.balances[index].fiatEstimate = available + onOrder;
        total += available + onOrder;
      }),
    );

    info.fiatEstimate = `~${fiat} ${total.toFixed(2)}`;
    return info;
  }

  async miniTickerStream(settings: Setting, callback) {
    const wsClient = BinanceWS(settings, callback);
    wsClient.subscribeAll24hrTickers('spot', true);
  }

  async balance(settings: Setting) {
    try {
      const balance = await this.client(settings).getAccountInformation();
      return balance;
    } catch (err) {
      console.log(err);
      this.logger.info(
        `getAccountInformation error: ${
          err.body ? JSON.stringify(err.body) : err
        }`,
      );
    }
  }

  userDataStream(settings: Setting, callback) {
    const wsClient = BinanceWS(settings, callback);
    wsClient.subscribeSpotUserDataStream();
  }

  chartStream(settings: Setting, symbol: string, interval: string, callback) {
    const wsClient = BinanceWS(settings, callback);
    const intervalKline =
      typeof interval === 'string' ? toKlineInterval(interval) : '1m';
    wsClient.subscribeSpotKline(symbol, intervalKline, true);
  }

  async getKlines(settings: Setting, params: KlinesParams) {
    const klines = await this.client(settings).getKlines(params);
    return klines;
  }

  tickerStream(settings: Setting, symbol: string, callback) {
    const wsClient = BinanceWS(settings, callback);
    wsClient.subscribeSpotSymbol24hrTicker(symbol, true);
  }
}
