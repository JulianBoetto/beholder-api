import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersTemplateModule } from '../orders-template/orders-template.module';
import { SymbolsModule } from '../symbols/symbols.module';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [PrismaModule, OrdersTemplateModule, SymbolsModule, ExchangeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
