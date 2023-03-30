import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BeholderController } from './beholder.controller';
import { BeholderService } from './beholder.service';
import { EmailModule } from '../email/email.module';
import { SmsModule } from '../sms/sms.module';
import { TelegramModule } from '../telegram/telegram.module';
import { OrdersModule } from '../orders/orders.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    SmsModule,
    TelegramModule,
    OrdersModule,
    SettingsModule,
  ],
  controllers: [BeholderController],
  providers: [BeholderService],
  exports: [BeholderService],
})
export class BeholderModule {}
