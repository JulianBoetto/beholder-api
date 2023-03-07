import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(
    email: string,
    data: object
  ) {
    const user = await this.findByEmail(email);
    if(!user) {
      throw new Error("User does not exists.")
    }
    const updatedUser = await this.prisma.user.update({
      where: {email}, data
    })
    return updatedUser;
  }

  async remove(id: string) { }
}
