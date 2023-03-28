import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { encryptData } from '../src/utils/encrypt';
import { monitorTypes } from '../src/utils/monitorTypes';
import actionsTypes from '../src/utils/types/actionsTypes';

const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash(process.env.ACCESS_PASSWORD, 10);
  const secretKey = await encryptData(process.env.API_SECRET_BINANCE);
  const twilioToken = await encryptData(process.env.TWILIO_TOKEN);
  const julian = await prisma.user.upsert({
    where: { email: 'julib_8724@hotmail.com' },
    update: {},
    create: {
      email: 'julib_8724@hotmail.com',
      password,
      apiUrl: 'https://testnet.binance.vision',
      accessKey: process.env.API_KEY_BINANCE,
      secretKey,
      streamUrl: 'wss://testnet.binance.vision',
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
  console.log('User: ', { julian });

  const defaultSymbol = 'BTCUSDT';
  const btcusdt = await prisma.symbol.upsert({
    where: { symbol: defaultSymbol },
    update: {},
    create: {
      symbol: defaultSymbol,
      basePrecision: 8,
      quotePrecision: 8,
      minNotional: '0.1',
      minLotSize: '0.1',
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

  const automation = await prisma.automation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Estratégia infalível',
      symbol: 'BTCUSDT',
      indexes: 'BTCUSDT:RSI_1m',
      schedule: '',
      conditions: "MEMORY['BTCUSDT:RSI_14_1m'].current>65",
      isActive: false,
      logs: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Automation: ', { automation });

  const action = await prisma.action.upsert({
    where: { id: 1 },
    update: {},
    create: {
      automationId: 1,
      type: actionsTypes.ALERT_EMAIL,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Action: ', { action });

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
      isActive: true,
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
      logs: true,
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
