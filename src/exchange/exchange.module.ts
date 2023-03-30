import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { UsersModule } from '../users/users.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [UsersModule, SettingsModule],
  providers: [ExchangeService],
  exports: [ExchangeService],
  controllers: [ExchangeController]
})
export class ExchangeModule { }
