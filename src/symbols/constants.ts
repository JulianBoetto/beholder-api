export const symbolsConstants = {
    useBlvt: process.env.BINANCE_BLVT === "true",
    ignoredCoins: process.env.IGNORED_COINS ? process.env.IGNORED_COINS.split(",") : []
}