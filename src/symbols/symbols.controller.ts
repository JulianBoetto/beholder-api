import { Body, Controller, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { GetSymbolDto } from './dto/get-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { SymbolsService } from './symbols.service';

@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) { }

  @Post('sync')
  create(@Request() req: AuthRequest) {
    const userId = req.user['userId'];
    return this.symbolsService.syncSymbols(userId);
  }

  @Get()
  findAll(@Query() query: GetSymbolDto) {
    return this.symbolsService.findAll(query);
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
