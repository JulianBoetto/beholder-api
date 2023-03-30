import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdersTemplateModule } from 'src/orders-template/orders-template.module';
import { SymbolsModule } from 'src/symbols/symbols.module';
import { ExchangeModule } from 'src/exchange/exchange.module';

@Module({
  imports: [PrismaModule, OrdersTemplateModule, SymbolsModule, ExchangeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
