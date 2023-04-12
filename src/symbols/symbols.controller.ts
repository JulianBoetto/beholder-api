import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { AuthRequest } from '../auth/models/AuthRequest';
import { GetSymbolDto } from './dto/get-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { SymbolsService } from './symbols.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSymbolDto } from './dto/create-symbol.dto';

@ApiBearerAuth('token')
@ApiTags('Symbols')
@Controller('symbols')
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @ApiOperation({ summary: "Sync symbols with the Binance exchange." })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateSymbolDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  create(@Request() req: AuthRequest) {
    const userId = req.user['userId'];
    return this.symbolsService.syncSymbols(userId);
  }

  @ApiOperation({ summary: "Get a list of symbols." })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateSymbolDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @Get()
  findAll(@Query() query: GetSymbolDto) {
    const { base, quote, page, onlyFavorites } = query;
    return this.symbolsService.findAll(base, quote, page, onlyFavorites);
  }

  @ApiOperation({ summary: "Get symbol by symbol name." })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateSymbolDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @Get(':symbol')
  findOne(@Param('symbol') symbol: string) {
    return this.symbolsService.getSymbol(symbol);
  }

  @ApiOperation({ summary: "Update symbol by symbol name." })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UpdateSymbolDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @Patch(':symbol')
  update(
    @Param('symbol') symbol: string,
    @Body() updateSymbolDto: UpdateSymbolDto,
  ) {
    return this.symbolsService.update(symbol, updateSymbolDto);
  }
}
