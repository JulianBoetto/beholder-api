import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { encryptData } from '../src/utils/encrypt';
import { monitorTypes } from '../src/utils/monitorTypes';
import actionsTypes from '../src/utils/types/actionsTypes';

const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash(process.env.ACCESS_PASSWORD, 10);
  const secretKey = await encryptData(process.env.API_SECRET_BINANCE);
  const twilioToken = await encryptData(process.env.TWILIO_TOKEN);
  const user = await prisma.user.upsert({
    where: { email: process.env.EMAIL },
    update: {},
    create: {
      email: process.env.EMAIL,
      password,
      apiUrl: 'https://testnet.binance.vision', // TEST
      accessKey: process.env.API_KEY_BINANCE,
      secretKey,
      streamUrl: 'wss://testnet.binance.vision', // TEST
      phone: process.env.PHONE,
      sendGridKey: process.env.SENDGRID_KEY,
      twilioSid: process.env.TWILIO_SID,
      twilioToken,
      twilioPhone: process.env.TWILIO_PHONE,
      telegramBot: process.env.TELEGRAM_BOT,
      telegramChat: process.env.TELEGRAM_CHAT,
      pushToken: '',
      refreshToken: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('User: ', { user });

  const defaultSymbol = 'BTCUSDT';
  const btcusdt = await prisma.symbol.upsert({
    where: { symbol: defaultSymbol },
    update: {},
    create: {
      symbol: defaultSymbol,
      basePrecision: 8,
      quotePrecision: 8,
      minNotional: '10.00000000',
      minLotSize: '0.00000100',
      isFavorite: true,
      base: 'BTC',
      quote: 'USDT',
      stepSize: '0.00000100',
      tickSize: '0.01000000',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Symbol: ', { btcusdt });

  const minorAutomation = await prisma.automation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'RSI menor',
      symbol: 'BTCUSDT',
      indexes: 'BTCUSDT:RSI_14_1m',
      schedule: '',
      conditions: "MEMORY['BTCUSDT:RSI_14_1m'].current<65",
      isActive: false,
      logs: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  const majorAutomation = await prisma.automation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'RSI Mayor',
      symbol: 'BTCUSDT',
      indexes: 'BTCUSDT:RSI_14_1m',
      schedule: '',
      conditions: "MEMORY['BTCUSDT:RSI_14_1m'].current>65",
      isActive: false,
      logs: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Automation: ', { minorAutomation });
  console.log('Automation: ', { majorAutomation });

  const orderTemplateBuy = await prisma.orderTemplate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Compra mkt minima',
      symbol: 'BTCUSDT',
      type: 'MARKET',
      side: 'BUY',
      limitPriceMultiplier: '1.0',
      stopPriceMultiplier: '1.0',
      quantity: 'MIN_NOTIONAL',
      quantityMultiplier: '1.0',
      icebergQtyMultiplier: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const orderTemplateSell = await prisma.orderTemplate.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Venta mkt minima',
      symbol: 'BTCUSDT',
      type: 'MARKET',
      side: 'SELL',
      limitPriceMultiplier: '1.0',
      stopPriceMultiplier: '1.0',
      quantity: 'MIN_NOTIONAL',
      quantityMultiplier: '1.0',
      icebergQtyMultiplier: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Order Templates: ', { orderTemplateBuy, orderTemplateSell });

  const emailAction = await prisma.action.upsert({
    where: { id: 1 },
    update: {},
    create: {
      automationId: 1,
      type: actionsTypes.ALERT_EMAIL,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const placeOrderBuyAction = await prisma.action.upsert({
    where: { id: 2 },
    update: {},
    create: {
      automationId: 1,
      orderTemplateId: 1,
      type: actionsTypes.ORDER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const placeOrderSellAction = await prisma.action.upsert({
    where: { id: 3 },
    update: {},
    create: {
      automationId: 2,
      orderTemplateId: 2,
      type: actionsTypes.ORDER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Action: ', { emailAction });
  console.log('Action: ', { placeOrderBuyAction });
  console.log('Action: ', { placeOrderSellAction });

  const miniTickerMonitor = await prisma.monitor.upsert({
    where: { id: 1 },
    update: {},
    create: {
      type: monitorTypes.MINI_TICKER,
      broadcastLabel: 'mini_ticker',
      symbol: '*',
      interval: '',
      isActive: true,
      isSystemMon: true,
      indexes: '',
      logs: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const bookMonitor = await prisma.monitor.upsert({
    where: { id: 2 },
    update: {},
    create: {
      type: monitorTypes.BOOK,
      broadcastLabel: 'book',
      symbol: '*',
      interval: '',
      isActive: true,
      isSystemMon: true,
      indexes: '',
      logs: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const userDataMonitor = await prisma.monitor.upsert({
    where: { id: 3 },
    update: {},
    create: {
      type: monitorTypes.USER_DATA,
      broadcastLabel: 'balance,execution',
      symbol: '*',
      interval: '',
      isActive: true,
      isSystemMon: true,
      indexes: '',
      logs: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const candlesMonitor = await prisma.monitor.upsert({
    where: { id: 4 },
    update: {},
    create: {
      type: monitorTypes.CANDLES,
      broadcastLabel: '',
      symbol: 'BTCUSDT',
      interval: '1m',
      isActive: false,
      isSystemMon: false,
      indexes: 'RSI_14',
      logs: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const tickerMonitor = await prisma.monitor.upsert({
    where: { id: 5 },
    update: {},
    create: {
      type: monitorTypes.TICKER,
      broadcastLabel: '',
      symbol: 'BTCUSDT',
      interval: '',
      isActive: true,
      isSystemMon: false,
      indexes: '',
      logs: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Monitor MINI_TICKER: ', { miniTickerMonitor });
  console.log('Monitor BOOK: ', { bookMonitor });
  console.log('Monitor USER_DATA: ', { userDataMonitor });
  console.log('Monitor CANDLES: ', { candlesMonitor });
  console.log('Monitor TICKER: ', { tickerMonitor });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
