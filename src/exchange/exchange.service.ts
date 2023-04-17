import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  AccountInformation,
  ExchangeInfo,
  KlinesParams,
  MainClient,
  NewSpotOrderParams
} from 'binance';
import { Logger } from 'winston';
import { ConverterService } from '../converter/converter.service';
import { PrismaService } from '../prisma/prisma.service';
import { Setting } from '../settings/entities/setting.entity';
import { SettingsService } from '../settings/settings.service';
import { User } from '../users/entities/user.entity';
import { toKlineInterval } from '../utils/types/klineIntervalTypes';
import { toOrderType } from '../utils/types/orderTypes';
import { BinanceWS } from '../utils/webSocket';
import {
  AccountInformationDto,
  BalanceDto,
  BalancesDto,
} from './dto/account-information.dto';
import { AveragesPricesDTO } from './dto/averages-prices.dto';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly converterService: ConverterService,
    private readonly prisma: PrismaService,
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
    try {
      const result: ExchangeInfo = await this.client(
        settings,
      ).getExchangeInfo();
      return result;
    } catch (err) {
      this.logger.info(`getExchangeInfo error: ${err.body ? err.body : err}`);
    }
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

  async getAveragePrices() {
    const result: AveragesPricesDTO[] = await this.prisma.$queryRaw`
      SELECT 
        MAX(symbol) AS symbol, SUM(net) AS net, SUM(quantity) AS quantity 
      FROM 
        OrderCoin 
      WHERE 
        side = 'BUY' AND status = 'FILLED' AND net > 0 
      GROUP BY 
        symbol;
    `;

    return result.map((r) => {
      return {
        symbol: r.symbol,
        net: r.net,
        qty: r.quantity,
        avg: r.net / r.quantity,
      };
    });
  }

  async getBalance(fiat: string, id: number) {
    try {
      const settings: Setting = await this.settingsService.getSettingsDecrypted(
        id,
      );
      const info = await this.loadBalance(settings, fiat);
      return info;
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      this.logger.info(err.response ? err.response.data : err);
    }
  }

  async getFullBalance(fiat: string, id: number) {
    try {
      const settings: Setting = await this.settingsService.getSettingsDecrypted(
        id,
      );
      const info = await this.loadBalance(settings, fiat);
      const averages = await this.getAveragePrices();
      const symbols = await this.prisma.symbol.findMany({
        where: { symbol: { in: averages.map((a) => a.symbol) } },
      });
      let symbolsObj = {};
      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        symbolsObj[symbol.symbol] = { base: symbol.base, quote: symbol.quote };
      }
      const grouped = {};
      for (let i = 0; i < averages.length; i++) {
        const averageObj = averages[i];
        const symbol = symbolsObj[averageObj.symbol];
        if (symbol.quote !== fiat) {
          averageObj.avg = await this.converterService.tryFiatConversion(
            symbol.quote,
            averageObj.avg,
            fiat,
          );
          averageObj.net = await this.converterService.tryFiatConversion(
            symbol.quote,
            averageObj.net,
            fiat,
          );
        }
        averageObj.symbol = symbol.base;
        if (!grouped[symbol.base]) grouped[symbol.base] = { net: 0, qty: 0 };
        grouped[symbol.base].net += averageObj.net;
        grouped[symbol.base].qty += averageObj.qty;
      }
      const coins = [...new Set(averages.map((a) => a.symbol))];
      coins.map(
        (coin) => (info.assets[coin].avg = Math.abs(grouped[coin].net / grouped[coin].qty)),
      );
      return info;
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
    if (fiat) fiat = fiat.toUpperCase();

    const info = await this.balance(settings);

    // All coins
    const coins = info.balances;

    let total = 0;
    const balances = await Promise.all(
      coins.map(async (coin: any, index: number) => {
        // Total available by coin
        let available = parseFloat(`${coins[index].free}`);

        if (available > 0)
          available = await this.converterService.tryFiatConversion(
            coin.asset,
            available,
            fiat,
          );

        let onOrder = parseFloat(`${coins[index].locked}`);
        if (onOrder > 0)
          onOrder = await this.converterService.tryFiatConversion(
            coin,
            onOrder,
            fiat,
          );

        const fiatEstimate = available + onOrder;
        total += fiatEstimate;

        return new BalanceDto(
          coin.asset,
          available.toFixed(8),
          onOrder.toFixed(8),
          fiatEstimate || 0,
        );
      }),
    );

    const fiatEstimate = `~${fiat.toUpperCase()} ${total.toFixed(2)}`;

    const balancesDto = new BalancesDto(
      balances.reduce((acc, curr) => {
        acc[curr.asset] = curr;
        return acc;
      }, {}),
      fiatEstimate,
    );

    return balancesDto;
  }

  async miniTickerStream(settings: Setting, callback) {
    const wsClient = BinanceWS(settings, callback);
    wsClient.subscribeAll24hrTickers('spot', true);
  }

  async balance(settings: Setting) {
    try {
      const balance: AccountInformation = await this.client(
        settings,
      ).getAccountInformation();
      return new AccountInformationDto(balance);
    } catch (err) {
      console.log(err);
      this.logger.info(
        `getAccountInformation error: ${
          err.body ? JSON.stringify(err.body) : err
        }`,
      );
    }
  }

  async SymbolBookTicker(setting: Setting, symbol: string) {
    const params = {
      symbol,
    };
    const result = await this.client(setting).getSymbolOrderBookTicker(params);
    return result;
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
