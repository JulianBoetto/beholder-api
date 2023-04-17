import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ConverterModule } from '../converter/converter.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [SettingsModule, ConverterModule, PrismaModule],
  providers: [ExchangeService],
  exports: [ExchangeService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
