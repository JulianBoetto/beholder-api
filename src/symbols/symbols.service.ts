import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { GetSymbolDto } from './dto/get-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';

@Injectable()
export class SymbolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService
  ) { }

  create(createSymbolDto: CreateSymbolDto) {
    return 'This action syncs all symbols';
  }

  async findAll(query: GetSymbolDto) {
    const { search, page, onlyFavorites } = query;

    if (search || page || onlyFavorites === 'true')
      return await this.searchSymbols(search, onlyFavorites === 'true', parseInt(page));
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

  async searchSymbols(search: string, onlyFavorites: boolean, page: number) {
    let options: object = {
      where: {},
      orderBy: { "symbol": "asc" },
      take: 10,
      skip: 10 * (page - 1)
    };

    let rawFavorites: number;

    if (onlyFavorites) {
      options = { ...options, where: { isFavorite: true } };
      rawFavorites = 10 * (page - 1);
    };

    if (search) {
      if (search.length < 6) {
        const symbolName: string = `%${search.toUpperCase()}%`;
        const filterSymbols: any = await this.prisma.$queryRaw`SELECT * FROM Symbol WHERE symbol LIKE ${symbolName} LIMIT 10 OFFSET ${rawFavorites}`
        const symbols: object = {
          count: filterSymbols.length,
          rows: filterSymbols
        }
        return symbols;
      } else {
        options = { ...options, where: { symbol: search } }
        const symbols: any = await this.prisma.$transaction([
          this.prisma.symbol.count(options),
          this.prisma.symbol.findMany(options)
        ]);
        return {
          count: symbols[0],
          rows: symbols[1]
        }
      }
    }
  }

  async getAllSymbols() {
    return await this.prisma.symbol.findMany();
  }

  async syncSymbols() {
    const favoriteSymbols = (await this.getAllSymbols()).filter(s => s.isFavorite).map(s => s.symbol);

    const settingsRepository = this.usersService.getSettings();
    // const settings = await settingsRepository.getSettingsDecrypted(res.locals.token.id);
    // const exchange = require('../utils/exchange')(settings);
    // let symbols = (await exchange.exchangeInfo()).symbols.map(item => {
    //     if(!useBlvt && item.baseAsset.endsWith("UP") || item.baseAsset.endsWith("DOWN")) return false;
    //     if(ignoredCoins.includes(item.quoteAsset) || ignoredCoins.includes(item.baseAsset)) return false;

    //     const minNotionalFilter = item.filters.find(filter => filter.filterType === 'MIN_NOTIONAL');
    //     const lotSizeFilter = item.filters.find(filter => filter.filterType === 'LOT_SIZE');
    //     const priceFilter = item.filters.find(filter => filter.filterType === 'PRICE_FILTER');

    //     return {
    //         symbol: item.symbol,
    //         basePrecision: item.baseAssetPrecision,
    //         quotePrecision: item.quoteAssetPrecision,
    //         base: item.baseAsset,
    //         quote: item.quoteAsset,
    //         stepSize: lotSizeFilter ? lotSizeFilter.stepSize : '1',
    //         tickSize: priceFilter ? priceFilter.tickSize : '1',
    //         minNotional: minNotionalFilter ? minNotionalFilter.minNotional : '1',
    //         minLotSize: lotSizeFilter ? lotSizeFilter.minQty : '1',
    //         isFavorite: favoriteSymbols.some(s => s === item.symbol)
    //     }
  }
}
