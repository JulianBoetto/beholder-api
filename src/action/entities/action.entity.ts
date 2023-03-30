import { OrderTemplate } from 'src/orders-template/entities/orderTemplate';

export class Action {
  id: number;
  automationId: number;
  type: string;
  orderTemplateId?: number;
  orderTemplate?: OrderTemplate;
  withdrawTemplateId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
