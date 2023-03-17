export interface MiniTicker {
    eventType: '24hrTicker';
    eventTime: number;
    symbol: string;
    priceChange: number;
    priceChangePercent: number;
    weightedAveragePrice: number;
    previousClose: number;
    currentClose: number;
    closeQuantity: number;
    bestBid: number;
    bestBidQuantity: number;
    bestAskPrice: number;
    bestAskQuantity: number;
    open: number;
    high: number;
    low: number;
    baseAssetVolume: number;
    quoteAssetVolume: number;
    openTime: number;
    closeTime: number;
    firstTradeId: number;
    lastTradeId: number;
    trades: number;
}

export function formatedOrder(order: MiniTicker) {
  return {
    close: order.currentClose,
    high: order.high,
    low: order.low,
    open: order.open,
  };
}
