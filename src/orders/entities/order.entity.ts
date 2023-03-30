export class Order {
  id: number;
  automationId?: number;
  symbol?: string;
  orderId?: BigInt;
  clientOrderId?: string;
  transactTime?: BigInt;
  type?: string;
  side?: string;
  status?: string;
  isMaker?: boolean;
  limitPrice?: string;
  stopPrice?: string;
  avgPrice?: string;
  commission?: string;
  net?: string;
  quantity?: string;
  icebergQty?: string;
  obs?: string;
  createdAt?: Date;
  updatedAt?: Date;
  automation?: [];
}
