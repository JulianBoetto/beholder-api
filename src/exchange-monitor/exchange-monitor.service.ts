import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeMonitorService {
  init(settings, wssInstance, beholderInstance) {
    if (!settings || !beholderInstance) throw new Error("Can't start Exchange Monitor without settings.");

    // WSS = wssInstance;
    // beholder = beholderInstance;
    // exchange = require('./utils/exchange')(settings);

    // const monitors = await getActiveMonitors();
    // monitors.map(monitor => {
    //   setTimeout(() => {
    //     switch (monitor.type) {
    //       case monitorTypes.MINI_TICKER:
    //         return startMiniTickerMonitor(monitor.id, monitor.broadcastLabel, monitor.logs);
    //       case monitorTypes.BOOK:
    //         return startBookMonitor(monitor.id, monitor.broadcastLabel, monitor.logs);
    //       case monitorTypes.USER_DATA:
    //         return startUserDataMonitor(monitor.id, monitor.broadcastLabel, monitor.logs);
    //       case monitorTypes.CANDLES:
    //         return startChartMonitor(
    //           monitor.id,
    //           monitor.symbol,
    //           monitor.interval,
    //           monitor.indexes ? monitor.indexes.split(",") : [],
    //           monitor.broadcastLabel,
    //           monitor.logs
    //         );
    //       case monitorTypes.TICKER:
    //         return startTickerMonitor(monitor.id, monitor.symbol, monitor.broadcastLabel, monitor.logs);
    //     }
    //   }, 250) // Binance only permits 5 commands / second
    // });

    // const lastOrders = await getLastFilledOrders();
    // await Promise.all(lastOrders.map(async (order) => {
    //   const orderCopy = getLightOrder(order.get({ plain: true }));
    //   await beholder.updateMemory(order.symbol, indexKeys.LAST_ORDER, null, orderCopy, false);
    // }))

    // logger("system", 'App Exchange Monitor is running!');
  }
}
