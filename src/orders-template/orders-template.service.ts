import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersTemplateService {
  constructor(private prisma: PrismaService) {}

  async getOrderTemplate(id: number) {
    return this.prisma.orderTemplate.findUnique({ where: { id } });
  }
}
