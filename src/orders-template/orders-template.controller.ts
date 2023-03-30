import { Controller } from '@nestjs/common';
import { OrdersTemplateService } from './orders-template.service';

@Controller('orders-template')
export class OrdersTemplateController {
  constructor(private readonly ordersTemplateService: OrdersTemplateService) {}
}
