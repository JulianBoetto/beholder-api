import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from './entities/order.entity';
import { orderStatus } from 'src/utils/orderTypes';
import { Prisma } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { Automation } from 'src/automations/entities/automation.entity';
import { Action } from 'src/action/entities/action.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  async updateOrderByOrderId(
    orderId: number,
    clientOrderId: number,
    newOrder: object,
  ) {
    const order: any = await this.getOrder(orderId, clientOrderId);
    if (!order) return false;
    return this.updateOrder(order, newOrder);
  }

  async getOrder(orderId: number, clientOrderId: number) {
    const order = await this.prisma.order.findMany({
      where: { orderId },
      // where: { orderId, clientOrderId },
      include: {
        automation: true,
      },
    });
    return order;
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

    // await this.prisma.order.update(currentOrder);
    return currentOrder;
  }

  async getLastFilledOrders() {
    const idObjects = await this.prisma.order.groupBy({
      by: ['symbol'],
      where: {
        status: orderStatus.FILLED,
      },
      _max: {
        id: true,
      },
    });
    let ids: number[] = idObjects.map((o) => o._max.id);

    return this.prisma.order.findMany({ where: { id: { in: ids } } });
  }

  async placeOrder(settings: User, automation: Automation, action: Action) {
    if (!settings || !automation || !action)
      throw new Error(`All parameters are required to place an older.`);
    if (!action.orderTemplateId)
      throw new Error(
        `There is no order template for "${automation.name}", action #${action.id}`,
      );

    // const orderTemplate = action.orderTemplate ? { ...action.orderTemplate } : await orderTemplatesRepository.getOrderTemplate(action.orderTemplateId);
    // if (orderTemplate.type === ordersRepository.orderTypes.TRAILING_STOP) {
    //     orderTemplate.type = ordersRepository.orderTypes.MARKET;
    //     orderTemplate.limitPrice = null;
    //     orderTemplate.stopPrice = null;
    // }

    // const symbol = await symbolsRepository.getSymbol(orderTemplate.symbol);

    // const order = {
    //     symbol: orderTemplate.symbol.toUpperCase(),
    //     side: orderTemplate.side.toUpperCase(),
    //     options: {
    //         type: orderTemplate.type.toUpperCase()
    //     }
    // };

    // const isDynamicBuy = order.side === "BUY" && ["MIN_NOTIONAL", "MAX_WALLET"].includes(orderTemplate.quantity);
    // if (order.options.type === "MARKET"
    //     && (isDynamicBuy || orderTemplate.quantity === "MIN_NOTIONAL")) {
    //     order.options.quoteOrderQty = calcQuoteQty(orderTemplate, symbol);
    // } else {

    // const price = calcPrice(orderTemplate, symbol, false);

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
    // }

    // let result;

    // const exchange = exchangeSettings(settings);

    // try {
    //     if (order.side === "BUY")
    //         result = await exchange.buy(order.symbol, order.quantity, order.limitPrice, order.options);
    //     else
    //         result = await exchange.sell(order.symbol, order.quantity, order.limitPrice, order.options);
    // } catch (err) {
    //     logger(`A_${automation.id}`, err.body ? err.body : err);
    //     logger(`A_${automation.id}`, order);
    //     return { type: "error", text: `Order failed! ` + err.body ? err.body : err.message };
    // }

    // const savedOrder = await ordersRepository.insertOrder({
    //     automationId: automation.id,
    //     symbol: order.symbol,
    //     quantity: order.quantity || result.executedQty,
    //     type: order.options.type,
    //     side: order.side,
    //     limitPrice: ordersRepository.LIMIT_TYPES.includes(order.type) ? order.limitPrice : null,
    //     stopPrice: ordersRepository.STOP_TYPES.includes(order.type) ? order.options.stopPrice : null,
    //     icebergQty: null,
    //     orderId: result.orderId,
    //     clientOrderId: result.clientOrderId,
    //     transactTime: result.transactTime,
    //     status: result.status || "NEW"
    // });

    // if (automation.logs) logger(`A_${automation.id}`, savedOrder.get({ plain: true }));

    // return { type: "success", text: `Order #${result.orderId} placed with status ${result.status} from automation ${automation.name}!` };
  }
}
