import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsModule } from '../settings/settings.module';
import { UsersModule } from '../users/users.module';
import { MonitorsController } from './monitors.controller';
import { MonitorsService } from './monitors.service';
import { ExchangeModule } from '../exchange/exchange.module';
import { BeholderModule } from '../beholder/beholder.module';
import { OrdersModule } from '../orders/orders.module';
import { IndicatorsModule } from '../indicators/indicators.module';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SettingsModule,
    ExchangeModule,
    BeholderModule,
    OrdersModule,
    IndicatorsModule,
    MemoryModule
  ],
  controllers: [MonitorsController],
  providers: [MonitorsService],
  exports: [MonitorsService]
})
export class MonitorsModule {}
