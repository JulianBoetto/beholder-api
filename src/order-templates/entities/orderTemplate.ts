export class OrderTemplate {
  id: number;
  name: string;
  symbol: string;
  type: string;
  side: string;
  limitPrice?: string;
  limitPriceMultiplier?: string;
  stopPrice?: string;
  stopPriceMultiplier?: string;
  quantity: string;
  quantityMultiplier?: string;
  icebergQty?: string;
  icebergQtyMultiplier: string;
  createdAt?: Date;
  updatedAt?: Date;
  action?: [];
  grid?: [];
}
