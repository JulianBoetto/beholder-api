import { Controller } from '@nestjs/common';
import { OrdersTemplateService } from './orders-template.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders Template')
@Controller('orders-template')
export class OrdersTemplateController {
  constructor(private readonly ordersTemplateService: OrdersTemplateService) {}
}
