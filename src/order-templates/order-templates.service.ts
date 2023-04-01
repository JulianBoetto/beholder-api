import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderTemplatesService {
  constructor(private prisma: PrismaService) {}

  async getOrderTemplate(id: number) {
    return this.prisma.orderTemplate.findUnique({ where: { id } });
  }
}
