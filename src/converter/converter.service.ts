import { Injectable } from '@nestjs/common';
import { MemoryService } from '../memory/memory.service';

@Injectable()
export class ConverterService {
  constructor(private readonly memoryService: MemoryService) {}

  private FIAT_COINS = process.env.FIAT_COINS.split(',');
  private DOLLAR_COINS = process.env.DOLLAR_COINS.split(',');

  async tryFiatConversion(baseAsset: string, baseQty: number, fiat: string) {
    if (fiat) fiat = fiat.toUpperCase();
    if (this.FIAT_COINS.includes(baseAsset) && baseAsset === fiat)
      return baseQty;

    const usd = this.tryUSDConversion(baseAsset, baseQty);
    if (fiat === 'USD' || !fiat) return usd;

    let book = await this.memoryService.getMemory(`USDT${fiat}`, 'BOOK');
    if (book) return (await usd) * book.current.bestBid;

    book = await this.memoryService.getMemory(`${fiat}USDT`, 'BOOK');
    if (book) return (await usd) / book.current.bestBid;

    return usd;
  }

  async tryUSDConversion(baseAsset: string, baseQty: number) {
    if (this.DOLLAR_COINS.includes(baseAsset)) return baseQty;
    if (this.FIAT_COINS.includes(baseAsset))
      return this.getFiatConversion('USDT', baseAsset, baseQty);

    for (let i = 0; i < this.DOLLAR_COINS.length; i++) {
      const converted = await this.getStableConversion(
        baseAsset,
        this.DOLLAR_COINS[i],
        baseQty,
      );
      if (converted > 0) return converted;
    }

    return 0;
  }

  async getStableConversion(
    baseAsset: string,
    quoteAsset: string,
    baseQty: number,
  ) {
    if (this.DOLLAR_COINS.includes(baseAsset)) return baseQty;

    let book = await this.memoryService.getMemory(
      baseAsset + quoteAsset,
      'BOOK',
      null,
    );
    if (book) return baseQty * book.current.bestBid;
    return 0;
  }

  async getFiatConversion(stableCoin, fiatCoin, fiatQty) {
    let book = await this.memoryService.getMemory(
      stableCoin + fiatCoin,
      'BOOK',
      null,
    );
    if (book) return parseFloat(fiatQty) / book.current.bestBid;
    return 0;
  }
}
