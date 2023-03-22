import { KlineInterval, WsMessageKlineFormatted, Kline } from 'binance';

export interface OriginalKline {
  startTime: number;
  endTime: number;
  symbol: string;
  interval: KlineInterval;
  firstTradeId: number;
  lastTradeId: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  trades: number;
  final: false;
  quoteVolume: number;
  volumeActive: number;
  quoteVolumeActive: number;
  ignored: number;
}

export interface FormatedKline {
  0: number;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}

export function wsToFormatKline(kline: WsMessageKlineFormatted) {
  return toFormatOhlc(kline.kline);
}

export function toFormatWsKline(kline: WsMessageKlineFormatted) {
  const klineFormated: any = toFormatWs(kline.kline);
  return klineFormated;
}

export function strToNumber(value: string | number) {
  if(typeof value === 'string') {
    return parseFloat(value)
  } else return value;
}

function toFormatOhlc(kline: OriginalKline) {
  return {
    open: kline.open,
    close: kline.close,
    low: kline.low,
    high: kline.high,
    volume: kline.volume,
  };
}

function toFormatWs(kline: OriginalKline) {
  return [
    kline.startTime,
    `${kline.open}`,
    `${kline.high}`,
    `${kline.low}`,
    `${kline.close}`,
    `${kline.volume}`,
  ];
}
