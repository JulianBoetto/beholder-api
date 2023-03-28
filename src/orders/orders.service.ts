import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from './entities/order.entity';
import { orderStatus } from 'src/utils/orderTypes';
import { Prisma } from '@prisma/client';

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
}
