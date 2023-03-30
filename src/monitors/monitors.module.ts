import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SettingsModule } from 'src/settings/settings.module';
import { UsersModule } from 'src/users/users.module';
import { MonitorsController } from './monitors.controller';
import { MonitorsService } from './monitors.service';
import { ExchangeModule } from 'src/exchange/exchange.module';
import { BeholderModule } from 'src/beholder/beholder.module';
import { OrdersModule } from 'src/orders/orders.module';
import { IndicatorsModule } from 'src/indicators/indicators.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SettingsModule,
    ExchangeModule,
    BeholderModule,
    OrdersModule,
    IndicatorsModule,
  ],
  controllers: [MonitorsController],
  providers: [MonitorsService],
  exports: [MonitorsService]
})
export class MonitorsModule {}
