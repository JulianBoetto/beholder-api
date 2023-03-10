import { Module } from '@nestjs/common';
import { ExchangeModule } from 'src/exchange/exchange.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SettingsModule } from 'src/settings/settings.module';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';

@Module({
  imports: [PrismaModule, SettingsModule, ExchangeModule],
  controllers: [SymbolsController],
  providers: [SymbolsService]
})
export class SymbolsModule { }
