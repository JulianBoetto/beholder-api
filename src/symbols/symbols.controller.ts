import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { SymbolsService } from './symbols.service';

@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @Post('sync')
  create(@Body() createSymbolDto: CreateSymbolDto) {
    return this.symbolsService.create(createSymbolDto);
  }

  @Get()
  findAll() {
    return this.symbolsService.findAll();
  }

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    return this.symbolsService.findOne(symbol);
  }

  @Patch(':symbol')
  update(@Param('symbol') symbol: string, @Body() updateSymbolDto: UpdateSymbolDto) {
    return this.symbolsService.update(symbol, updateSymbolDto);
  }
}
