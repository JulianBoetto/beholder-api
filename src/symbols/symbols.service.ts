import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { GetSymbolDto } from './dto/get-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';

@Injectable()
export class SymbolsService {
  constructor(private readonly prisma: PrismaService) { }

  create(createSymbolDto: CreateSymbolDto) {
    return 'This action syncs all symbols';
  }

  async findAll(query: GetSymbolDto) {
    const { search, page, onlyFavorites } = query;

    if (search || page || onlyFavorites === 'true')
      return await this.searchSymbols(search, onlyFavorites === 'true', parseInt(page));
    else
      return await this.getSymbols(query);
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

  async getSymbols(query: GetSymbolDto) {

  }
}
