const FIAT_COINS = ["BRL", "EUR", "GBP"];
const DOLLAR_COINS = ["USD", "USDT", "BUSD", "USDC"];


export function tryFiatConversion(baseAsset: string, baseQty: number, fiat: string) {
    if (fiat) fiat = fiat.toUpperCase();
    if (FIAT_COINS.includes(baseAsset) && baseAsset === fiat) return baseQty;

    const usd = tryUSDConversion(baseAsset, baseQty);
    if (fiat === "USD" || !fiat) return usd;

    // let book = getMemory(`USDT${fiat}`, "BOOK");
    // if (book) return usd * book.current.bestBid;

    // book = getMemory(`${fiat}USDT`, "BOOK");
    // if (book) return usd / book.current.bestBid;

    return usd;
}

function tryUSDConversion(baseAsset: string, baseQty: number) {
    if (DOLLAR_COINS.includes(baseAsset)) return baseQty;
    if (FIAT_COINS.includes(baseAsset)) return getFiatConversion("USDT", baseAsset, baseQty);

    for (let i = 0; i < DOLLAR_COINS.length; i++) {
        const converted = getStableConversion(baseAsset, DOLLAR_COINS[i], baseQty);
        if (converted > 0) return converted;
    }

    return 0;
}

function getStableConversion(baseAsset: string, quoteAsset: string, baseQty: number) {
    if (DOLLAR_COINS.includes(baseAsset)) return baseQty;

    // let book = getMemory(baseAsset + quoteAsset, "BOOK", null);
    // if (book) return parseFloat(baseQty) * book.current.bestBid;
    return 0;
}

function getFiatConversion(stableCoin, fiatCoin, fiatQty) {
    // let book = getMemory(stableCoin + fiatCoin, "BOOK", null);
    // if (book) return parseFloat(fiatQty) / book.current.bestBid;
    return 0;
}

// function getMemory(symbol, index, interval) {
//     if (symbol && index) {
//         const indexKey = interval ? `${index}_${interval}` : index;
//         const memoryKey = `${symbol}:${indexKey}`;

//         const result = MEMORY[memoryKey];
//         return typeof result === "object" ? { ...result } : result;
//     }
//     return { ...MEMORY };
// }