import { PrismaClient } from '@prisma/client'
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()
async function main() {
    const password = await bcrypt.hash(process.env.ACCESS_PASSWORD, 10)
    const julian = await prisma.user.upsert({
        where: { email: 'julib_8724@hotmail.com' },
        update: {},
        create: {
            email: 'julib_8724@hotmail.com',
            password,
            apiUrl: "https://testnet.binance.vision/api",
            accessKey: process.env.API_KEY_BINANCE,
            secretKey: process.env.API_SECRET_BINANCE,
            createdAt: new Date(),
            updatedAt: new Date(),
            streamUrl: "wss://testnet.binance.vision/ws",
            phone: process.env.PHONE,
            sendGridKey: process.env.SENDGRID_KEY,
            twilioSid: process.env.TWILIO_SID,
            twilioToken: process.env.TWILIO_TOKEN,
            twilioPhone: process.env.TWILIO_PHONE,
            telegramBot: process.env.TELEGRAM_BOT,
            telegramChat: process.env.TELEGRAM_CHAT,
            pushToken: ""
        },
    })
    console.log({ julian })
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

