import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(parseInt(id));
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(email, updateUserDto)
  }
}
