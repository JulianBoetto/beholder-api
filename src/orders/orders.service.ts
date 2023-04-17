import { Inject, Injectable } from '@nestjs/common';
import { Action } from '../action/entities/action.entity';
import { Automation } from '../automations/entities/automation.entity';
import { ExchangeService } from '../exchange/exchange.service';
import { OrderTemplate } from '../order-templates/entities/orderTemplate';
import { OrderTemplatesService } from '../order-templates/order-templates.service';
import { PrismaService } from '../prisma/prisma.service';
import { Symbol } from '../symbols/entities/symbol.entity';
import { User } from '../users/entities/user.entity';
import { orderStatus, orderTypes } from '../utils/orderTypes';
import {
  LIMIT_TYPES,
  OrderResponseFull,
  PlaceOrderType,
  STOP_TYPES,
} from '../utils/types/orderTypes';
import { Logger } from 'winston';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('winston') private logger: Logger,
    private readonly prisma: PrismaService,
    private orderTemplatesService: OrderTemplatesService,
    private exchangeService: ExchangeService,
  ) {}

  async updateOrderByOrderId(
    orderId: number,
    clientOrderId: number,
    newOrder: object,
  ) {
    const order: any = await this.getOrder(orderId, clientOrderId);
    if (!order) return false;
    return this.updateOrder(order, newOrder);
  }

  async updateOrder(currentOrder: Order, newOrder: any) {
    if (!currentOrder || !newOrder) return false;

    if (
      newOrder.status &&
      newOrder.status !== currentOrder.status &&
      (currentOrder.status === orderStatus.NEW ||
        currentOrder.status === orderStatus.PARTIALLY_FILLED)
    )
      currentOrder.status = newOrder.status; //somente dá para atualizar ordens não finalizadas

    if (newOrder.avgPrice && newOrder.avgPrice !== currentOrder.avgPrice)
      currentOrder.avgPrice = newOrder.avgPrice;

    if (
      newOrder.isMaker !== null &&
      newOrder.isMaker !== undefined &&
      newOrder.isMaker !== currentOrder.isMaker
    )
      currentOrder.isMaker = newOrder.isMaker;

    if (
      newOrder.obs !== null &&
      newOrder.obs !== undefined &&
      newOrder.obs !== currentOrder.obs
    )
      currentOrder.obs = newOrder.obs;

    if (
      newOrder.transactTime &&
      newOrder.transactTime !== currentOrder.transactTime
    )
      currentOrder.transactTime = newOrder.transactTime;

    if (
      newOrder.commission !== null &&
      newOrder.commission !== undefined &&
      newOrder.commission !== currentOrder.commission
    )
      currentOrder.commission = newOrder.commission;

    if (newOrder.quantity && newOrder.quantity !== currentOrder.quantity)
      currentOrder.quantity = newOrder.quantity;

    if (
      newOrder.net !== null &&
      newOrder.net !== undefined &&
      newOrder.net !== currentOrder.net
    )
      currentOrder.net = newOrder.net;

    // await this.prisma.orderCoin.update(currentOrder);
    return currentOrder;
  }

  async getLastFilledOrders() {
    const idObjects = await this.prisma.orderCoin.groupBy({
      by: ['symbol'],
      where: {
        status: orderStatus.FILLED,
      },
      _max: {
        id: true,
      },
    });
    let ids: number[] = idObjects.map((o) => o._max.id);

    return this.prisma.orderCoin.findMany({ where: { id: { in: ids } } });
  }

  private async calcQuoteQty(orderTemplate: OrderTemplate, symbol: Symbol) {
    if (orderTemplate.type !== 'MARKET' || parseFloat(orderTemplate.quantity)) {
      this.logger.info(
        `Order Template ${orderTemplate} by ${symbol}: Only MARKET orders can calc quote qty.`,
      );
      return;
    }

    const multiplier = parseFloat(orderTemplate.quantityMultiplier);

    if (orderTemplate.quantity === 'MAX_WALLET') {
      //     if (orderTemplate.side !== "BUY") throw new Error(`Only MARKET BUY orders can calc quote qty with MAX_WALLET`);
      //     const asset = MEMORY[`${symbol.quote}:WALLET`];
      //     if (!asset) throw new Error(`There is no ${symbol.quote} in your wallet to place a buy.`);
      //     return (parseFloat(asset) * (multiplier > 1 ? 1 : multiplier)).toFixed(symbol.quotePrecision);
    } else if (orderTemplate.quantity === 'MIN_NOTIONAL') {
      const multiplierValue = multiplier < 1 ? 1 : multiplier;
      const quoteQty = parseFloat(symbol.minNotional) * multiplierValue;
      return quoteQty.toFixed(symbol.quotePrecision);
    }

    this.logger.info(
      `Invalid order template quantity ${orderTemplate.quantity}`,
    );
    return;
  }

  private calcPrice(
    orderTemplate: OrderTemplate,
    symbol: Symbol,
    tipo: boolean,
  ) {
    return;
  }

  // Routes
  getLastOrders() {
    // return the last orders
  }

  getOrdersReport(quote: string) {
    // return the orders report for the given quote
  }

  async getOrder(orderId: number, clientOrderId: number) {
    const order = await this.prisma.orderCoin.findMany({
      where: { orderId },
      // where: { orderId, clientOrderId },
      include: {
        automation: true,
      },
    });
    return order;
  }

  getOrders(symbol?: string) {
    // return the orders for the given symbol (if provided), or all orders otherwise
  }

  syncOrder(id: string) {
    // sync the order with the given id
  }

  newOrder(id: number, order: Order) {}

  async placeOrder(settings: User, automation: Automation, action: Action) {
    if (!settings || !automation || !action) {
      this.logger.info(
        `Error in Automation ${automation.id}: All parameters are required to place an older.`,
      );
      return {
        type: 'error',
        text: `Error in Automation ${automation.id}: All parameters are required to place an older.`,
      };
    }
    if (!action.orderTemplateId) {
      this.logger.info(
        `There is no order template for "${automation.name}" id: ${automation.id}, action #${action.id}`,
      );
      return {
        type: 'error',
        text: `There is no order template for "${automation.name}" id: ${automation.id}, action #${action.id}`,
      };
    }

    const orderTemplate: OrderTemplate = action.orderTemplate
      ? { ...action.orderTemplate }
      : await this.orderTemplatesService.getOrderTemplate(
          action.orderTemplateId,
        );

    if (orderTemplate.type === orderTypes.TRAILING_STOP) {
      orderTemplate.type = orderTypes.MARKET;
      orderTemplate.limitPrice = null;
      orderTemplate.stopPrice = null;
    }

    const symbol: Symbol = await this.prisma.symbol.findUnique({
      where: {
        symbol: orderTemplate.symbol,
      },
    });

    const order: PlaceOrderType = {
      symbol: orderTemplate.symbol.toUpperCase(),
      side: orderTemplate.side.toUpperCase(),
      options: {
        type: orderTemplate.type.toUpperCase(),
        quoteOrderQty: undefined,
        stopPrice: undefined,
      },
    };

    const isDynamicBuy =
      order.side === 'BUY' &&
      ['MIN_NOTIONAL', 'MAX_WALLET'].includes(orderTemplate.quantity);
    if (
      order.options.type === 'MARKET' &&
      (isDynamicBuy || orderTemplate.quantity === 'MIN_NOTIONAL')
    ) {
      order.options.quoteOrderQty = await this.calcQuoteQty(
        orderTemplate,
        symbol,
      );
    } else {
      const price = this.calcPrice(orderTemplate, symbol, false);
      // if (!isFinite(price) || !price)
      //     throw new Error(`Error in calcPrice function, params: OTID ${orderTemplate.id}, $: ${price}, stop: false`);
      //     if (ordersRepository.LIMIT_TYPES.includes(order.options.type))
      //         order.limitPrice = price;
      //     const quantity = calcQty(orderTemplate, price, symbol, false);
      //     if (!isFinite(quantity) || !quantity)
      //         throw new Error(`Error is calcQty function, params: OTID ${orderTemplate.id}, $: ${price}, qty: ${quantity}`);
      //     order.quantity = quantity;
      //     if (ordersRepository.STOP_TYPES.includes(order.options.type)) {
      //         const stopPrice = calcPrice(orderTemplate, symbol, true);
      //         if (!isFinite(stopPrice) || !stopPrice)
      //             throw new Error(`Error is calcQty function, params: OTID ${orderTemplate.id}, $: ${stopPrice}, stop: true`);
      //         order.options.stopPrice = stopPrice;
      //     }
      //     if (!hasEnoughAssets(symbol, order, price))
      //         throw new Error(`You wanna ${order.side} ${order.quantity} ${order.symbol} but you haven't enough assets.`);
    }

    let result: OrderResponseFull | any;

    try {
      if (order.side === 'BUY')
        result = await this.exchangeService.orderBuy(
          settings,
          order.symbol,
          order.quantity,
          order.limitPrice,
          order.options,
        );
      else
        result = await this.exchangeService.orderSell(
          settings,
          order.symbol,
          order.quantity,
          order.limitPrice,
          order.options,
        );
    } catch (err) {
      this.logger.info(
        `Automation ${automation.id}: ${
          err.body ? JSON.stringify(err.body) : err
        }`,
      );
      this.logger.info(`Automation ${automation.id}: ${JSON.stringify(order)}`);
      return {
        type: 'error',
        text: `Order failed! ` + err.body ? err.body : err.message,
      };
    }

    const savedOrder = await this.prisma.orderCoin.create({
      data: {
        automationId: automation.id,
        symbol: order.symbol,
        quantity: order.quantity || result.executedQty,
        type: order.options.type,
        side: order.side,
        limitPrice: LIMIT_TYPES.includes(order.options.type)
          ? order.limitPrice
          : null,
        stopPrice: STOP_TYPES.includes(order.options.type)
          ? order.options.stopPrice
          : null,
        icebergQty: null,
        orderId: result.orderId,
        clientOrderId: result.clientOrderId,
        transactTime: result.transactTime,
        status: result.status || 'NEW',
      },
    });

    if (automation.logs)
      this.logger.info(
        `Automation ${automation.id}: ${JSON.stringify(savedOrder)}`,
      );

    return {
      type: 'success',
      text: `Order #${result.orderId} placed with status ${result.status} from automation ${automation.name}!`,
    };
  }

  cancelOrder(symbol: string, orderId: string) {
    // cancel the order with the given symbol and orderId
  }
}
