import { Module } from '@nestjs/common';
import { OrderTemplatesService } from './order-templates.service';
import { OrdersTemplateController } from './order-templates.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersTemplateController],
  providers: [OrderTemplatesService],
  exports: [OrderTemplatesService]
})
export class OrderTemplatesModule {}
