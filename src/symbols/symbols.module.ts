import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsModule } from '../settings/settings.module';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [PrismaModule, SettingsModule, ExchangeModule],
  controllers: [SymbolsController],
  providers: [SymbolsService],
  exports: [SymbolsService],
})
export class SymbolsModule {}
