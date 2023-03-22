export class Order {
  id: number;
  automationId?: number;
  symbol?: string;
  orderId?: number;
  clientOrderId?: number;
  transactTime?: number;
  type?: string;
  side?: string;
  status?: string;
  isMaker?: boolean;
  limitPrice?: string;
  stopPrice?: string;
  avgPrice?: number;
  commission?: string;
  net?: number;
  quantity?: string;
  icebergQty?: string;
  obs?: string;
  createdAt?: Date;
  updatedAt?: Date;
  automation?: [];
}
