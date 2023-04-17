import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderTemplatesModule } from '../order-templates/order-templates.module';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [PrismaModule, OrderTemplatesModule, ExchangeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
