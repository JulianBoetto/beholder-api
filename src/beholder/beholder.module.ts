import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BeholderController } from './beholder.controller';
import { BeholderService } from './beholder.service';
import { EmailModule } from 'src/email/email.module';
import { SmsModule } from 'src/sms/sms.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { OrdersModule } from 'src/orders/orders.module';
import { SettingsModule } from 'src/settings/settings.module';

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
