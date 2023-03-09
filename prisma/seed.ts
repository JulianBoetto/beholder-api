import { PrismaClient } from '@prisma/client'
import * as bcrypt from "bcrypt"
import { encryptData } from '../src/utils/encrypt'

const prisma = new PrismaClient()
async function main() {
    const password = await bcrypt.hash(process.env.ACCESS_PASSWORD, 10)
    const secretKey = await encryptData(process.env.API_SECRET_BINANCE)
    const twilioToken = await encryptData(process.env.TWILIO_TOKEN)
    const julian = await prisma.user.upsert({
        where: { email: 'julib_8724@hotmail.com' },
        update: {},
        create: {
            email: 'julib_8724@hotmail.com',
            password,
            apiUrl: "https://testnet.binance.vision/api",
            accessKey: process.env.API_KEY_BINANCE,
            secretKey,
            streamUrl: "wss://testnet.binance.vision/ws",
            phone: process.env.PHONE,
            sendGridKey: process.env.SENDGRID_KEY,
            twilioSid: process.env.TWILIO_SID,
            twilioToken,
            twilioPhone: process.env.TWILIO_PHONE,
            telegramBot: process.env.TELEGRAM_BOT,
            telegramChat: process.env.TELEGRAM_CHAT,
            pushToken: "",
            refreshToken: "",
            createdAt: new Date(),
            updatedAt: new Date()
        },
    })
    console.log({ julian })

    const defaultSymbol = "BTCUSDT";
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
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    console.log({ btcusdt })

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

