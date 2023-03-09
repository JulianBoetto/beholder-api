import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async update(
    userId: number,
    data: object
  ) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException("User does not exist.")
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: userId }, data
    })
    return updatedUser;
  }

  async getSettings(id: number) {
    return this.prisma.user.findFirst({ where: { id } });
  }
}
