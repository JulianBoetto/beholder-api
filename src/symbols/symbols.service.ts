import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';

@Injectable()
export class SymbolsService {
  constructor(private readonly prisma: PrismaService) { }

  create(createSymbolDto: CreateSymbolDto) {
    return 'This action syncs all symbols';
  }

  async findAll() {
    return await this.prisma.symbol.findMany();
  }

  async findOne(symbolId: string) {
    const symbol = await this.prisma.symbol.findUnique({ where: { symbol: symbolId } });
    if (symbol) return symbol;
    return [];
  }

  update(symbol: string, updateSymbolDto: UpdateSymbolDto) {
    return `This action updates a #${symbol} symbol`;
  }
}
