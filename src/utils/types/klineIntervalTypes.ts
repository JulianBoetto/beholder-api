import { KlineInterval } from "binance";

export function toKlineInterval(intervalStr: string): KlineInterval | undefined {
  switch (intervalStr) {
    case '1s':
    case '1m':
    case '3m':
    case '5m':
    case '15m':
    case '30m':
    case '1h':
    case '2h':
    case '4h':
    case '6h':
    case '8h':
    case '12h':
    case '1d':
    case '3d':
    case '1w':
    case '1M':
      return intervalStr as KlineInterval;
    default:
      return undefined;
  }
}
