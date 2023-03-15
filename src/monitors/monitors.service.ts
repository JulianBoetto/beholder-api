import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Kline } from 'binance';
import { BeholderService } from 'src/beholder/beholder.service';
import { ExchangeService } from 'src/exchange/exchange.service';
import { OrdersService } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { indexKeys } from 'src/utils/indexes';
import { monitorTypes } from 'src/utils/monitorTypes';
import { orderStatus } from 'src/utils/orderTypes';
import { toKlineInterval } from 'src/utils/types/klineTypes';
import { Logger } from 'winston';
import { Monitor } from './entities/monitor.entity';

@Injectable()
export class MonitorsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
    private readonly exchangeService: ExchangeService,
    private readonly beholderService: BeholderService,
    private readonly ordersService: OrdersService,
  ) {}

  @Inject('winston') private logger: Logger;

  private WSS: any;
  private beholder: any;
  private settings: Setting;
  private book: any = [];
  private symbols: any = [];

  onModuleInit() {
    this.init();
  }

  async init() {
    const settings = await this.settingsService.getSettingsDecrypted(
      this.usersService.setUserId(),
    );
    this.settings = settings;

    if (!settings)
      throw new Error("Can't start Exchange Monitor without settings.");

    // WSS = wssInstance;
    // beholder = beholderInstance;

    const monitors: Monitor[] = await this.getActiveMonitors();
    monitors.map((monitor) => {
      setTimeout(async () => {
        switch (monitor.type) {
          case monitorTypes.MINI_TICKER:
            return await this.startMiniTickerMonitor(
              monitor.id,
              monitor.broadcastLabel,
              monitor.logs,
            );
          case monitorTypes.BOOK:
            return await this.startBookMonitor(
              monitor.id,
              monitor.broadcastLabel,
              monitor.logs,
            );
          case monitorTypes.USER_DATA:
            return await this.startUserDataMonitor(
              monitor.id,
              monitor.broadcastLabel,
              monitor.logs,
            );
          case monitorTypes.CANDLES:
            return this.startChartMonitor(
              monitor.id,
              monitor.symbol,
              monitor.interval,
              monitor.indexes ? monitor.indexes.split(',') : [],
              monitor.broadcastLabel,
              monitor.logs,
            );
          // case monitorTypes.TICKER:
          //     return startTickerMonitor(monitor.id, monitor.symbol, monitor.broadcastLabel, monitor.logs);
        }
      }, 250); // Binance only permits 5 commands / second
    });

    // const lastOrders = await getLastFilledOrders();
    // await Promise.all(lastOrders.map(async (order) => {
    //     const orderCopy = getLightOrder(order.get({ plain: true }));
    //     await beholder.updateMemory(order.symbol, indexKeys.LAST_ORDER, null, orderCopy, false);
    // }))

    this.logger.info('App Exchange Monitor is running!');
  }

  startChartMonitor(
    monitorId: number,
    symbol: string,
    interval: string,
    indexes: string[],
    broadcastLabel: string,
    logs: boolean,
  ) {
    if (!symbol)
      return new Error("You can't start a Chart Monitor without a symbol!");
    // if (!exchange) return new Error("Exchange Monitor not initialized yet!");

    this.exchangeService.chartStream(
      this.settings,
      symbol,
      interval,
      async (ohlc: {
        e: string;
        E: number;
        k: {
          o: string;
          c: string;
          h: string;
          l: string;
          v: string;
          t: number;
          T: number;
        };
        s: string;
        wsKey: string;
        wsMarket: string;
      }) => {
        const intervalKline =
          typeof interval === 'string' ? toKlineInterval(interval) : '1m';
        const params = {
          symbol,
          interval: intervalKline,
          limit: 4,
        };
        const previousKlines: Kline[] = await this.exchangeService.getKlines(
          this.settings,
          params,
        );
        const lastCandle = {
          open: ohlc.k.o,
          close: ohlc.k.c,
          high: ohlc.k.h,
          low: ohlc.k.l,
          volume: ohlc.k.v,
        };

        const previousCandle = {
          open: previousKlines[previousKlines.length - 2][1],
          close: previousKlines[previousKlines.length - 2][4],
          high: previousKlines[previousKlines.length - 2][2],
          low: previousKlines[previousKlines.length - 2][3],
          volume: previousKlines[previousKlines.length - 2][5],
        };

        const previousPreviousCandle = {
          open: previousKlines[previousKlines.length - 3][1],
          close: previousKlines[previousKlines.length - 3][4],
          high: previousKlines[previousKlines.length - 3][2],
          low: previousKlines[previousKlines.length - 3][3],
          volume: previousKlines[previousKlines.length - 3][5],
        };

        if (logs) this.logger.info(`Monitor ${monitorId}: ${lastCandle}`);

        try {
          o this.beholderService.updateMemory(
            symbol,
            indexKeys.LAST_CANDLE,
            interval,
            { current: lastCandle, previous: previousCandle },
            false,
          );
          this.beholderService.updateMemory(
            symbol,
            indexKeys.PREVIOUS_CANDLE,
            interval,
            { current: previousCandle, previous: previousPreviousCandle },
            false,
          );
          // if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: lastCandle });
          let results: any = await this.processChartData(
            monitorId,
            symbol,
            indexes,
            interval,
            ohlc,
            logs,
          );
          results.push(
            await this.beholderService.testAutomations(
              this.beholderService.parseMemoryKey(
                symbol,
                indexKeys.LAST_CANDLE,
                interval,
              ),
            ),
          );
          results.push(
            await this.beholderService.testAutomations(
              this.beholderService.parseMemoryKey(
                symbol,
                indexKeys.PREVIOUS_CANDLE,
                interval,
              ),
            ),
          );
          if (results) {
            if (logs)
              this.logger.info(
                `Monitor ${monitorId}: ChartStream Results: ${results.flat()}`,
              );
            // results.flat().map((result) => sendMessage({ notification: result }));
          }
        } catch (err) {
          this.logger.info(`Monitor ${monitorId}: ${err}`);
        }
      },
    );
    this.logger.info(
      `Monitor ${monitorId}: Chart Monitor has started at ${symbol}_${interval}`,
    );
  }

  async processChartData(
    monitorId: number,
    symbol: string,
    indexes: string[] | string,
    interval: string,
    ohlc: any,
    logs: boolean,
  ) {
    if (typeof indexes === 'string') indexes = indexes.split(',');
    if (!indexes || !Array.isArray(indexes) || indexes.length === 0)
      return false;

    const memoryKeys = [];

    indexes.map((index) => {
      const params = index.split('_');
      const indexName = params[0];
      params.splice(0, 1);

      try {
        // const calc = this.execCalc(indexName, ohlc, ...params);
        // if (logs)
        //   this.logger.info(
        //     `Monitor: ${monitorId}: ${indexName}_${interval} calculated: ${JSON.stringify(
        //       calc.current ? calc.current : calc,
        //     )}`,
        //   );
        // this.beholderService.updateMemory(symbol, index, interval, calc, false);

        memoryKeys.push(
          this.beholderService.parseMemoryKey(symbol, index, interval),
        );
      } catch (err) {
        this.logger.info(
          `Monitor ${monitorId}: Exchange Monitor => Can't calc the index ${index}:`,
        );
        this.logger.info(`Monitor ${monitorId}: ${err}`);
      }
    });

    return Promise.all(
      memoryKeys.map(async (key) => {
        return this.beholderService.testAutomations(key);
      }),
    );
  }

  async startUserDataMonitor(
    monitorId: number,
    broadcastLabel: string,
    logs: boolean,
  ) {
    // if (!exchange) return new Error("Exchange Monitor not initialized yet!");

    const [balanceBroadcast, executionBroadcast] = broadcastLabel
      ? broadcastLabel.split(',')
      : [null, null];

    try {
      await this.loadWallet();

      this.exchangeService.userDataStream(this.settings, (data) => {
        if (data.e === 'executionReport')
          this.processExecutionData(monitorId, data, executionBroadcast);
        else if (
          data.e === 'balanceUpdate' ||
          data.e === 'outboundAccountPosition'
        )
          this.processBalanceData(monitorId, balanceBroadcast, logs, data);
      });
      this.logger.info(
        `Monitor ${monitorId}: User Data Monitor has started at ${broadcastLabel}`,
      );
    } catch (err) {
      this.logger.info(
        `Monitor ${monitorId}: User Data Monitor has NOT started! ${err.message}`,
      );
    }
  }

  async processBalanceData(
    monitorId: number,
    broadcastLabel: string,
    logs: boolean,
    data: object,
  ) {
    if (logs) this.logger.info(`Monitor ${monitorId}: ${data}`);

    try {
      const wallet = await this.loadWallet();
      // if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: wallet });
    } catch (err) {
      if (logs) this.logger.error(`Monitor ${monitorId}: ${err}`);
    }
  }

  async loadWallet() {
    // if (!exchange) return new Error("Exchange Monitor not initialized yet!");

    const info: any = await this.exchangeService.balance(this.settings);
    const wallet = info.balances.map(
      async (balance: { asset: string; free: string; locked: string }) => {
        const results = await this.beholderService.updateMemory(
          balance.asset,
          indexKeys.WALLET,
          null,
          parseFloat(balance.free),
        );

        //   if (results) results.map((result) => sendMessage({ notification: result }));

        return {
          symbol: balance.asset,
          available: balance.free,
          onOrder: balance.locked,
        };
      },
    );
    return wallet;
  }

  async getActiveMonitors() {
    return await this.prisma.monitor.findMany({ where: { isActive: true } });
  }

  async startMiniTickerMonitor(
    monitorId: number,
    broadcastLabel: string,
    logs: boolean,
  ) {
    // if (!this.exchange)
    //   return new Error('Exchange Monitor not initialized yet!');

    this.exchangeService.miniTickerStream(this.settings, (markets: any) => {
      if (logs) this.logger.info(`Monitor ${monitorId}: ${markets}`);

      try {
        markets.map(async (mkt: any) => {
          const symbol = mkt.s;
          // this.symbols.push(symbol);
          delete mkt.e;
          delete mkt.E;
          delete mkt.v;
          delete mkt.q;
          delete mkt.s;
          const converted = {
            close: parseFloat(mkt.c),
            high: parseFloat(mkt.h),
            low: parseFloat(mkt.l),
            open: parseFloat(mkt.o),
          };
          const results: any = await this.beholderService.updateMemory(
            symbol,
            indexKeys.MINI_TICKER,
            null,
            converted,
          );

          // if (results) results.map(r => sendMessage({ notification: r }));
          // if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: markets });
          if (results)
            results.map((r) => this.logger.info(`Mini-Ticker results: ${r}`));

          //simulação de book
          const book = {
            symbol,
            bestAsk: parseFloat(mkt.c),
            bestBid: parseFloat(mkt.c),
          };

          const currentMemory = this.beholderService.getMemory(
            book.symbol,
            indexKeys.BOOK,
          );

          const newMemory: any = {};
          newMemory.previous = currentMemory ? currentMemory.current : book;
          newMemory.current = book;

          this.beholderService
            .updateMemory(book.symbol, indexKeys.BOOK, null, newMemory)
            .then((results) => {
              // if (results) results.map((r) => sendMessage({ notification: r }));
            });

          return book;
        });
        // if (WSS) sendMessage({ book: books });
        //fim da simulação de book
      } catch (err) {
        if (logs) this.logger.info(`Monitor ${monitorId}: ${err}`);
      }
    });

    this.logger.info(
      `Monitor ${monitorId}: Mini-Ticker Monitor has started at ${broadcastLabel}`,
    );
  }

  private async startBookMonitor(
    monitorId: number,
    broadcastLabel: string,
    logs: boolean,
  ) {
    // if (!exchange) return new Error("Exchange Monitor not initialized yet!");

    this.exchangeService.bookStream(
      this.settings,
      this.symbols,
      async (order: any) => {
        if (logs)
          this.logger.info(
            `Monitor: ${monitorId}: ${order.s} (best bid: ${parseFloat(
              order.b,
            ).toFixed(2)} / best ask: ${parseFloat(order.a).toFixed(2)})`,
          );

        if (this.book.length >= 200) {
          // if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: book });

          this.book = [];
        } else this.book.push(order);

        const orderCopy: {
          s: string;
          u: string;
          A: string;
          B: string;
          e: string;
          wsKey: string;
          wsMarket: string;
        } = { ...order };
        delete orderCopy.s;
        delete orderCopy.u;
        delete orderCopy.A;
        delete orderCopy.B;
        delete orderCopy.e;
        delete orderCopy.wsKey;
        delete orderCopy.wsMarket;

        const converted = {
          bestAsk: parseFloat(order.a),
          bestBid: parseFloat(order.b),
        };

        const currentMemory = this.beholderService.getMemory(
          order.s,
          indexKeys.BOOK,
        );
        const newMemory: any = {};
        newMemory.previous = currentMemory ? currentMemory.current : converted;
        newMemory.current = converted;
        const results = await this.beholderService.updateMemory(
          order.s,
          indexKeys.BOOK,
          null,
          newMemory,
        );

        // if (results)
        //   results.map((result) => sendMessage({ notification: result }));
      },
    );

    this.logger.info(
      `Monitor ${monitorId}: Book Monitor has started at ${broadcastLabel}`,
    );
  }

  async processExecutionData(
    monitorId: number,
    executionData: any,
    broadcastLabel: string,
  ) {
    if (executionData.x === orderStatus.NEW) return;

    const order = {
      symbol: executionData.s,
      orderId: executionData.i,
      clientOrderId:
        executionData.X === orderStatus.CANCELED
          ? executionData.C
          : executionData.c,
      side: executionData.S,
      type: executionData.o,
      status: executionData.X,
      isMaker: executionData.m,
      transactTime: executionData.T,
      avgPrice: 0,
      commission: '',
      quantity: 0,
      net: 0,
      obs: '',
    };

    if (order.status === orderStatus.FILLED) {
      const quoteAmount = parseFloat(executionData.Z);
      order.avgPrice = quoteAmount / parseFloat(executionData.z);
      order.commission = executionData.n;
      order.quantity = executionData.q;
      const isQuoteCommission =
        executionData.N && order.symbol.endsWith(executionData.N);
      order.net = isQuoteCommission
        ? quoteAmount - parseFloat(order.commission)
        : quoteAmount;
    }

    if (order.status === orderStatus.REJECTED) order.obs = executionData.r;

    setTimeout(async () => {
      try {
        const updatedOrder = await this.ordersService.updateOrderByOrderId(
          order.orderId,
          order.clientOrderId,
          order,
        );
        if (updatedOrder) {
          // notifyOrderUpdate(order);
          // const orderCopy = getLightOrder(updatedOrder.get({ plain: true }));
          // const results = await this.beholderService.updateMemory(
          //   updatedOrder.symbol,
          //   indexKeys.LAST_ORDER,
          //   null,
          //   orderCopy,
          // );
          // if (results)
          //   results.map((result) => sendMessage({ notification: result }));
          // if (broadcastLabel && WSS)
          //   sendMessage({ [broadcastLabel]: orderCopy });
        }
      } catch (err) {
        this.logger.info(`Monitor ${monitorId}: ${err}`);
      }
    }, 3000);
  }
}
