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
import { ExchangeMonitorModule } from './exchange-monitor/exchange-monitor.module';
import { WebsocketModule } from './websocket/websocket.module';
import { WsAdapter } from './utils/ws-adapter';

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
    ExchangeMonitorModule,
    WebsocketModule,],
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
    WsAdapter
  ],
})
export class AppModule { }
