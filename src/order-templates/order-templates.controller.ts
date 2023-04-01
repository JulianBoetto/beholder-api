import { Controller } from '@nestjs/common';
import { OrderTemplatesService } from './order-templates.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order Templates')
@Controller('order-templates')
export class OrdersTemplateController {
  constructor(private readonly orderTemplatesService: OrderTemplatesService) {}

  
}
