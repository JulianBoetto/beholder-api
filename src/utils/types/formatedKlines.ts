export interface OriginalKline {
  e: string;
  k: { c: string; h: string; l: string; o: string; v: string, t: number };
  E: number;
  s: string;
  wsKey: string;
  wsMarket: string;
}

export interface FormatedKline {
    open: string,
    close: string,
    low: string,
    high: string,
    volume: string,
    // time: number,
}

export function toFormatKline(kline: OriginalKline) {
  const newKline = toFormatOhlc(kline);
  return newKline;
}

function toFormatOhlc(kline: OriginalKline) {
  return {
    open: kline.k.o,
    close: kline.k.c,
    low: kline.k.l,
    high: kline.k.h,
    volume: kline.k.v,
    // time: kline.k.t
  };
}
