import { Module } from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { SymbolsController } from './symbols.controller';

@Module({
  controllers: [SymbolsController],
  providers: [SymbolsService]
})
export class SymbolsModule {}
