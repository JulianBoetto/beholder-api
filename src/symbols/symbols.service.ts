import { Injectable } from '@nestjs/common';
import {
  ExchangeInfo,
  SymbolExchangeInfo,
  SymbolLotSizeFilter,
  SymbolMinNotionalFilter,
  SymbolPriceFilter
} from 'binance';
import { ExchangeService } from '../exchange/exchange.service';
import { PrismaService } from '../prisma/prisma.service';
import { Setting } from '../settings/entities/setting.entity';
import { SettingsService } from '../settings/settings.service';
import { symbolsConstants } from './constants';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { Symbol } from './entities/symbol.entity';

@Injectable()
export class SymbolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly exhangeService: ExchangeService,
  ) {}

  async findAll(
    base?: string,
    quote?: string,
    page?: number,
    onlyFavorites?: string,
  ) {
    if (base || quote || page || onlyFavorites === 'true')
      return await this.searchSymbols(
        base,
        quote,
        onlyFavorites === 'true',
        page,
      )
    else return await this.getAllSymbols();
  }
  create(createSymbolDto: CreateSymbolDto) {
    return 'This action syncs all symbols';
  }

  async update(symbol: string, updateSymbol: UpdateSymbolDto) {
    let symbolBase = await this.prisma.symbol.findUnique({ where: { symbol } });
    if (
      updateSymbol.isFavorite !== undefined &&
      updateSymbol.isFavorite !== symbolBase.isFavorite
    ) {
      symbolBase.isFavorite = updateSymbol.isFavorite;
      return await this.prisma.symbol.update({
        where: { symbol },
        data: symbolBase,
      });
    }
    return symbolBase;
  }

  async searchSymbols(
    base: string,
    quote: string,
    onlyFavorites: boolean,
    page: number = 1,
  ) {
    let options: object = {
      where: {},
      orderBy: { symbol: 'asc' },
      take: 10,
      skip: 10 * (page - 1),
    };

    if (quote) {
      options = {
        ...options,
        where: { quote: quote.toUpperCase(), isFavorite: onlyFavorites },
      };
    } else if (base) {
      options = {
        ...options,
        where: { base: base.toUpperCase(), isFavorite: onlyFavorites },
      };
    } else {
      options = {
        ...options,
        where: { isFavorite: onlyFavorites },
      };
    }

    const symbols: any = await this.prisma.$transaction([
      this.prisma.symbol.count(options),
      this.prisma.symbol.findMany(options),
    ]);
    return {
      count: symbols[0],
      rows: symbols[1],
    };
  }

  async getSymbol(symbolName: string) {
    return await this.prisma.symbol.findUnique({
      where: { symbol: symbolName },
    });
  }

  async getAllSymbols(isFavorite?: boolean) {
    let options: object;
    if (isFavorite !== undefined) {
      options = { where: { isFavorite } };
    }
    return await this.prisma.symbol.findMany(options);
  }

  async syncSymbols(id: number) {
    const favoriteSymbols: string[] = (await this.getAllSymbols(true)).map(
      (s) => s.symbol,
    );
    const settings: Setting = await this.settingsService.getSettingsDecrypted(
      id,
    );
    const exchangeInfo: ExchangeInfo = await this.exhangeService.exchangeInfo(
      settings,
    );
    let symbols: Symbol[] = exchangeInfo.symbols.map(
      (item: SymbolExchangeInfo) => {
        if (
          (!symbolsConstants.useBlvt && item.baseAsset.endsWith('UP')) ||
          item.baseAsset.endsWith('DOWN')
        )
          return;

        if (
          symbolsConstants.ignoredCoins.includes(item.quoteAsset) ||
          symbolsConstants.ignoredCoins.includes(item.baseAsset)
        )
          return;

        const minNotionalFilter: SymbolMinNotionalFilter | any =
          item.filters.find(
            (filter: { filterType: string }) =>
              filter.filterType === 'MIN_NOTIONAL',
          );
        const lotSizeFilter: SymbolLotSizeFilter | any = item.filters.find(
          (filter: { filterType: string }) => filter.filterType === 'LOT_SIZE',
        );
        const priceFilter: SymbolPriceFilter | any = item.filters.find(
          (filter: { filterType: string }) =>
            filter.filterType === 'PRICE_FILTER',
        );

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
          isFavorite: favoriteSymbols.length
            ? favoriteSymbols.some((s) => s === item.symbol)
            : false,
        };
      },
    );

    if (symbols && symbols.length) {
      await this.prisma.symbol.deleteMany();
      await this.prisma.symbol.createMany({
        data: symbols,
        skipDuplicates: true,
      });
    }

    return symbols;
  }
}
