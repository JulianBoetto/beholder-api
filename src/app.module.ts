import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { winstonConfig } from './configs/winston.config';
import { ExchangeModule } from './exchange/exchange.module';
import { LoggerInterceptor } from './interceptors/logger.interceptors';
import { MonitorsModule } from './monitors/monitors.module';
import { PrismaModule } from './prisma/prisma.module';
import { SettingsModule } from './settings/settings.module';
import { SymbolsModule } from './symbols/symbols.module';
import { UsersModule } from './users/users.module';
import { BeholderModule } from './beholder/beholder.module';
import { AutomationsModule } from './automations/automations.module';
import { WsAdapter } from './utils/webSocket';
import { OrdersModule } from './orders/orders.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { EmailModule } from './email/email.module';
import { TelegramModule } from './telegram/telegram.module';
import { SmsService } from './sms/sms.service';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    WinstonModule.forRoot(winstonConfig),
    SymbolsModule,
    MonitorsModule,
    SettingsModule,
    ExchangeModule,
    BeholderModule,
    AutomationsModule,
    OrdersModule,
    IndicatorsModule,
    EmailModule,
    SmsModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    WsAdapter,
    SmsService
  ],
})
export class AppModule { }
