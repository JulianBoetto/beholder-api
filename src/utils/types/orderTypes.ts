import { OrderFill, OrderTimeInForce, OrderType } from 'binance';
import { Order } from 'src/orders/entities/order.entity';

export interface PlaceOrderType {
  symbol: string;
  side: string;
  quantity?: string;
  limitPrice?: string;
  options: {
    type: string;
    quoteOrderQty: string | undefined;
    stopPrice: string | undefined;
  };
}

export interface FormatedOrder {
  symbol?: string;
  type?: string;
  side?: string;
  status?: string;
  limitPrice?: number;
  stopPrice?: number;
  avgPrice?: number;
  net?: number;
  quantity?: number;
  icebergQty?: number;
}

export function getLightLastOrder(order: Order) {
  return {
    symbol: order.symbol,
    type: order.type,
    side: order.side,
    status: order.status,
    limitPrice: order.limitPrice ? parseFloat(order.limitPrice) : null,
    stopPrice: order.stopPrice ? parseFloat(order.stopPrice) : null,
    avgPrice: order.avgPrice ? parseFloat(order.avgPrice) : null,
    net: order.net ? parseFloat(order.net) : null,
    quantity: order.quantity ? parseFloat(order.quantity) : null,
    icebergQty: order.icebergQty ? parseFloat(order.icebergQty) : null,
  };
}

export function toOrderType(orderType: string): OrderType | undefined {
  switch (orderType) {
    case 'LIMIT':
    case 'LIMIT_MAKER':
    case 'MARKET':
    case 'STOP_LOSS':
    case 'STOP_LOSS_LIMIT':
    case 'TAKE_PROFIT':
    case 'TAKE_PROFIT_LIMIT':
      return orderType as OrderType;
    default:
      return undefined;
  }
}

const orderTypes = {
  STOP_LOSS: 'STOP_LOSS',
  STOP_LOSS_LIMIT: 'STOP_LOSS_LIMIT',
  TAKE_PROFIT: 'TAKE_PROFIT',
  TAKE_PROFIT_LIMIT: 'TAKE_PROFIT_LIMIT',
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  ICEBERG: 'ICEBERG',
  TRAILING_STOP: 'TRAILING_STOP',
};

export const STOP_TYPES = [
  orderTypes.STOP_LOSS,
  orderTypes.STOP_LOSS_LIMIT,
  orderTypes.TAKE_PROFIT,
  orderTypes.TAKE_PROFIT_LIMIT,
];

export const LIMIT_TYPES = [
  orderTypes.LIMIT,
  orderTypes.STOP_LOSS_LIMIT,
  orderTypes.TAKE_PROFIT_LIMIT,
];

export interface OrderResponseFull {
  symbol: string;
  orderId: number;
  orderListId?: number;
  clientOrderId: string;
  transactTime: number;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: OrderStatus;
  timeInForce: OrderTimeInForce;
  type: OrderType;
  side: 'BUY' | 'SELL';
  marginBuyBorrowAmount?: number;
  marginBuyBorrowAsset?: string;
  isIsolated?: boolean;
  fills: OrderFill[];
}

export declare type OrderStatus =
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELED'
  | 'PENDING_CANCEL'
  | 'REJECTED'
  | 'EXPIRED';
