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

  findAll() {
    return this.prisma.symbol.findMany();
  }

  findOne(symbol: string) {
    return `This action returns a #${symbol} symbol`;
  }

  update(symbol: string, updateSymbolDto: UpdateSymbolDto) {
    return `This action updates a #${symbol} symbol`;
  }
}
