import { Module } from '@nestjs/common';
import { OrdersTemplateService } from './orders-template.service';
import { OrdersTemplateController } from './orders-template.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersTemplateController],
  providers: [OrdersTemplateService],
  exports: [OrdersTemplateService]
})
export class OrdersTemplateModule {}
