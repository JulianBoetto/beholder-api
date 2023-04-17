import { Decimal } from "@prisma/client/runtime";

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
  avgPrice?: Decimal;
  commission?: string;
  net?: Decimal;
  quantity?: string;
  icebergQty?: string;
  obs?: string;
  createdAt?: Date;
  updatedAt?: Date;
  automation?: [];
}
