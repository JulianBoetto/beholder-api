import { Injectable } from '@nestjs/common';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';

@Injectable()
export class SymbolsService {
  create(createSymbolDto: CreateSymbolDto) {
    return 'This action syncs all symbols';
  }

  findAll() {
    return `This action returns all symbols`;
  }

  findOne(symbol: string) {
    return `This action returns a #${symbol} symbol`;
  }

  update(symbol: string, updateSymbolDto: UpdateSymbolDto) {
    return `This action updates a #${symbol} symbol`;
  }
}
