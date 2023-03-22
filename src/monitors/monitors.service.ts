import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AccountInformation,
  Kline,
  WsMessage24hrMiniTickerFormatted,
  WsMessage24hrTickerFormatted,
  WsMessageKlineFormatted,
} from 'binance';
import { BeholderService } from 'src/beholder/beholder.service';
import { ExchangeService } from 'src/exchange/exchange.service';
import { IndicatorsService } from 'src/indicators/indicators.service';
import { OrdersService } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { indexKeys } from 'src/utils/indexes';
import { monitorTypes } from 'src/utils/monitorTypes';
import { orderStatus } from 'src/utils/orderTypes';
import {
  FormatedKline,
  strToNumber,
  toFormatWsKline,
  wsToFormatKline,
} from 'src/utils/types/formatedKlines';
import { toKlineInterval } from 'src/utils/types/klineIntervalTypes';
import { Logger } from 'winston';
import { Monitor } from './entities/monitor.entity';
import { MiniTicker, formatedOrder } from 'src/utils/types/formatedTicker';

@Injectable()
export class MonitorsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
    private readonly exchangeService: ExchangeService,
    private readonly beholderService: BeholderService,
    private readonly ordersService: OrdersService,
    private readonly indicatorsService: IndicatorsService,
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

    // this.logger.info('App Exchange Monitor is running!');
  }

  async startChartMonitor(
    monitorId: number,
    symbol: string,
    interval: string,
    indexes: string[],
    broadcastLabel: string,
    logs: boolean,
  ) {
    if (!symbol)
      return new Error("You can't start a Chart Monitor without a symbol!");

    let previousKlines: Kline[] = [];
    this.exchangeService.chartStream(
      this.settings,
      symbol,
      interval,
      async (originalWsKline: WsMessageKlineFormatted) => {
        const ohlc = wsToFormatKline(originalWsKline);

        if (!previousKlines.length) {
          const intervalKline =
            typeof interval === 'string' ? toKlineInterval(interval) : '1m';
          const params = {
            symbol,
            interval: intervalKline,
            // LIMIT FOR KLINES
            limit: 500,
          };
          previousKlines = await this.exchangeService.getKlines(
            this.settings,
            params,
          );
        } else {
          const wsKlines: Kline = toFormatWsKline(originalWsKline);
          if (
            originalWsKline.kline.startTime !==
            previousKlines[previousKlines.length - 1][0]
          ) {
            previousKlines.push(wsKlines);
            previousKlines.shift();
          }
          previousKlines[previousKlines.length - 1] = wsKlines;
        }

        const lastCandle = ohlc;
        // console.log(
        //   originalWsKline.kline.startTime,
        //   lastCandle.close,
        //   originalWsKline.kline.endTime,
        // );
        // console.log(
        //   previousKlines[previousKlines.length - 2][0],
        //   previousKlines[previousKlines.length - 2][4],
        //   previousKlines[previousKlines.length - 2][6],
        // );
        // console.log(
        //   previousKlines[previousKlines.length - 3][0],
        //   previousKlines[previousKlines.length - 3][4],
        //   previousKlines[previousKlines.length - 3][6],
        // );
        // console.log(
        //   previousKlines[previousKlines.length - 4][0],
        //   previousKlines[previousKlines.length - 4][4],
        //   previousKlines[previousKlines.length - 4][6],
        // );

        const previousCandle = {
          open: strToNumber(previousKlines[previousKlines.length - 2][1]),
          close: strToNumber(previousKlines[previousKlines.length - 2][4]),
          high: strToNumber(previousKlines[previousKlines.length - 2][2]),
          low: strToNumber(previousKlines[previousKlines.length - 2][3]),
          volume: strToNumber(previousKlines[previousKlines.length - 2][5]),
        };

        const previousPreviousCandle = {
          open: strToNumber(previousKlines[previousKlines.length - 3][1]),
          close: strToNumber(previousKlines[previousKlines.length - 3][4]),
          high: strToNumber(previousKlines[previousKlines.length - 3][2]),
          low: strToNumber(previousKlines[previousKlines.length - 3][3]),
          volume: strToNumber(previousKlines[previousKlines.length - 3][5]),
        };

        if (logs)
          this.logger.info(
            `Monitor ${monitorId}: ${JSON.stringify(lastCandle)}`,
          );

        try {
          this.beholderService.updateMemory(
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
          // //   // if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: lastCandle });
          let results: any = await this.processChartData(
            monitorId,
            symbol,
            indexes,
            interval,
            previousKlines,
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
            if (logs) {
              const resultsStr = results.map((result) =>
                result.length === 0 ? false : result,
              );
              this.logger.info(
                `Monitor ${monitorId}: ChartStream Results: ${resultsStr.flat()}`,
              );
            }
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
        const { calc, paramsDetail } = this.indicatorsService.execCalc(
          indexName,
          ohlc,
          params,
        );
        if (logs) {
          const detail =
            paramsDetail && paramsDetail[0]
              ? `with params: ${paramsDetail.flat().join(', ')}`
              : '';
          this.logger.info(
            `Monitor: ${monitorId}: ${indexName}_${interval} calculated: ${JSON.stringify(
              calc.current ? calc.current : calc,
            )} ${detail}`,
          );
        }

        this.beholderService.updateMemory(symbol, index, interval, calc, false);

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
    const [balanceBroadcast, executionBroadcast] = broadcastLabel
      ? broadcastLabel.split(',')
      : [null, null];

    try {
      await this.loadWallet();

      this.exchangeService.userDataStream(this.settings, (data) => {
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
    const info: AccountInformation = await this.exchangeService.balance(
      this.settings,
    );
    const wallet = info.balances.map(
      async (balance: { asset: string; free: string; locked: string }) => {
        const results: any[] = await this.beholderService.updateMemory(
          balance.asset,
          indexKeys.WALLET,
          null,
          parseFloat(balance.free),
        );

        if (results.length)
          results.map((result) => {
            // sendMessage({ notification: result });
          });

        return {
          symbol: balance.asset,
          available: parseFloat(balance.free),
          onOrder: parseFloat(balance.locked),
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
    this.exchangeService.miniTickerStream(
      this.settings,
      (markets: MiniTicker[]) => {
        if (logs)
          this.logger.info(
            `Monitor ${monitorId}: Mini-Ticker Stream with ${markets.length} symbols`,
          );

        try {
          markets.map(async (mkt: MiniTicker) => {
            const symbol = mkt.symbol;
            const converted = formatedOrder(mkt);
            const results: any = await this.beholderService.updateMemory(
              symbol,
              indexKeys.MINI_TICKER,
              null,
              converted,
            );

            // if (results) results.map(r => sendMessage({ notification: r }));
            // if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: markets });

            if (results)
              results.map((r: boolean) =>
                this.logger.info(`Mini-Ticker results: ${r}`),
              );

            //simulação de book
            const book = {
              symbol,
              bestAsk: mkt.bestAskPrice,
              bestBid: mkt.bestBid,
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
      },
    );

    this.logger.info(
      `Monitor ${monitorId}: Mini-Ticker Monitor has started at ${broadcastLabel}`,
    );
  }

  private async startBookMonitor(
    monitorId: number,
    broadcastLabel: string,
    logs: boolean,
  ) {
    // ALL FUNCTIONS ARE IN startMiniTickerMonitor()
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
        // this.logger.info(`Monitor ${monitorId}: ${err}`);
      }
    }, 3000);
  }
}
