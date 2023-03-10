import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ExchangeService],
  exports: [ExchangeService],
  controllers: [ExchangeController]
})
export class ExchangeModule { }
