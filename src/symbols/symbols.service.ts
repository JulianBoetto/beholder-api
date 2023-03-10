import { Injectable } from '@nestjs/common';
import { ExchangeService } from 'src/exchange/exchange.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { SettingsService } from 'src/settings/settings.service';
import { symbolsConstants } from './constants';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { GetSymbolDto } from './dto/get-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';

@Injectable()
export class SymbolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly exhangeService: ExchangeService
  ) { }

  create(createSymbolDto: CreateSymbolDto) {
    return 'This action syncs all symbols';
  }

  async findAll(query: GetSymbolDto) {
    const { base, quote, page, onlyFavorites } = query;

    if (base || quote || page || onlyFavorites === 'true')
      return await this.searchSymbols(base, quote, onlyFavorites === 'true', parseInt(page));
    else
      return await this.getAllSymbols();
  }

  async findOne(symbolId: string) {
    const symbol = await this.prisma.symbol.findUnique({ where: { symbol: symbolId } });
    if (symbol) return symbol;
    return [];
  }

  async update(symbol: string, updateSymbolDto: UpdateSymbolDto) {
    return `This action updates a #${symbol} symbol`;
  }

  async searchSymbols(base: string, quote: string, onlyFavorites: boolean, page: number) {
    let options: object = {
      where: {},
      orderBy: { "symbol": "asc" },
      take: 10,
      skip: 10 * (page - 1)
    };

    if (quote) {
      options = { ...options, where: { quote: quote.toUpperCase(), isFavorite: onlyFavorites } };
    } else {
      options = { ...options, where: { base: base.toUpperCase(), isFavorite: onlyFavorites } };
    }

    const symbols: any = await this.prisma.$transaction([
      this.prisma.symbol.count(options),
      this.prisma.symbol.findMany(options)
    ]);
    return {
      count: symbols[0],
      rows: symbols[1]
    }
  }


  async getAllSymbols() {
    return await this.prisma.symbol.findMany();
  }

  async syncSymbols(id: number) {
    const favoriteSymbols = (await this.getAllSymbols()).filter(s => s.isFavorite).map(s => s.symbol);

    const settings: Setting = await this.settingsService.getSettingsDecrypted(id);
    const exchangeInfo: any = await this.exhangeService.exchangeInfo(settings);
    let symbols: any = exchangeInfo.symbols.map((item: any) => {
      if (!symbolsConstants.useBlvt && item.baseAsset.endsWith("UP") || item.baseAsset.endsWith("DOWN")) return false;
      if (symbolsConstants.ignoredCoins.includes(item.quoteAsset) || symbolsConstants.ignoredCoins.includes(item.baseAsset)) return false;

      const minNotionalFilter = item.filters.find((filter: { filterType: string; }) => filter.filterType === 'MIN_NOTIONAL');
      const lotSizeFilter = item.filters.find((filter: { filterType: string; }) => filter.filterType === 'LOT_SIZE');
      const priceFilter = item.filters.find((filter: { filterType: string; }) => filter.filterType === 'PRICE_FILTER');

      return {
        symbol: item.symbol,
        basePrecision: item.baseAssetPrecision,
        quotePrecision: item.quoteAssetPrecision,
        base: item.baseAsset,
        quote: item.quoteAsset,
        stepSize: lotSizeFilter ? lotSizeFilter.stepSize : '1',
        tickSize: priceFilter ? priceFilter.tickSize : '1',
        minNotional: minNotionalFilter ? minNotionalFilter.minNotional : '1',
        minLotSize: lotSizeFilter ? lotSizeFilter.minQty : '1',
        isFavorite: favoriteSymbols.some(s => s === item.symbol)
      }
    }).filter((s: any) => s);

    if (symbols && symbols.length) {
      await this.prisma.symbol.deleteMany();
      await this.prisma.symbol.createMany({ data: symbols, skipDuplicates: true })
    }

    return symbols
  }
}
