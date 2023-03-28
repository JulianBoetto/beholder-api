export class Action {
  id: number;
  automationId: number;
  type: string;
  orderTemplateId?: number;
  withdrawTemplateId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
