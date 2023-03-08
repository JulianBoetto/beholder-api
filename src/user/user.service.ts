import { BadRequestException, Injectable } from '@nestjs/common';
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
    return this.prisma.user.findFirst({ where: { id } });
  }

  async create(
    data: object
  ) {
    // const newUser = await this.prisma.user.create({data})
    // return newUser;
    console.log(data)
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

  async remove(id: string) { }
}
