import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BeholderService } from 'src/beholder/beholder.service';
import { ExchangeService } from 'src/exchange/exchange.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { indexKeys } from 'src/utils/indexes';
import { monitorTypes } from 'src/utils/monitorTypes';
import { Logger } from 'winston';

@Injectable()
export class MonitorsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
    private readonly exchangeService: ExchangeService,
    private readonly beholderService: BeholderService,
  ) {}

  @Inject('winston') private logger: Logger;

  private WSS: any;
  private beholder: any;
  private settings: Setting;

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

    const monitors = await this.getActiveMonitors();
    monitors.map((monitor) => {
      setTimeout(() => {
        switch (monitor.type) {
          case monitorTypes.MINI_TICKER:
            return this.startMiniTickerMonitor(
              monitor.id,
              monitor.broadcastLabel,
              monitor.logs,
            );
          case monitorTypes.BOOK:
            return this.startBookMonitor(
              monitor.id,
              monitor.broadcastLabel,
              monitor.logs,
            );
          // case monitorTypes.USER_DATA:
          //     return startUserDataMonitor(monitor.id, monitor.broadcastLabel, monitor.logs);
          // case monitorTypes.CANDLES:
          //     return startChartMonitor(
          //         monitor.id,
          //         monitor.symbol,
          //         monitor.interval,
          //         monitor.indexes ? monitor.indexes.split(",") : [],
          //         monitor.broadcastLabel,
          //         monitor.logs
          //     );
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

    // this.logger("system", 'App Exchange Monitor is running!');
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

  private book: any[];
  private startBookMonitor(
    monitorId: number,
    broadcastLabel: string,
    logs: boolean,
  ) {
    // if (!exchange) return new Error("Exchange Monitor not initialized yet!");

    this.exchangeService.bookStream(this.settings, (order) => {
      this.logger.info(`Monitor: ${monitorId}: ${order}`);

      if (this.book.length >= 200) {
        // if (broadcastLabel && WSS) sendMessage({ [broadcastLabel]: book });

        this.book = [];
      } else this.book.push(order);

      const orderCopy = { ...order };
      delete orderCopy.symbol;
      delete orderCopy.updateId;
      delete orderCopy.bestAskQty;
      delete orderCopy.bestBidQty;

      const converted = {};
    //   Object.entries(orderCopy).map(
    //     (prop) => (converted[prop[0]] = parseFloat(prop[1])),
    //   );

    //   const currentMemory = this.beholderService.getMemory(order.symbol, indexKeys.BOOK);

    //   const newMemory: any = {};
    //   newMemory.previous = currentMemory ? currentMemory.current : converted;
    //   newMemory.current = converted;

    //   const results = await this.beholderService.updateMemory(
    //     order.symbol,
    //     indexKeys.BOOK,
    //     null,
    //     newMemory,
    //   );

    //   if (results)
    //     results.map((result) => sendMessage({ notification: result }));
    });

    this.logger.info(`Monitor ${monitorId}: Book Monitor has started at ${broadcastLabel}`);
  }
}
