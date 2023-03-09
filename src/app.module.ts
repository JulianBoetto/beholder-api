import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { winstonConfig } from './configs/winston.config';
import { LoggerInterceptor } from './interceptors/logger.interceptors';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SymbolsModule } from './symbols/symbols.module';
import { MonitorsModule } from './monitors/monitors.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    WinstonModule.forRoot(winstonConfig),
    SymbolsModule,
    MonitorsModule,
    SettingsModule,],
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
  ],
})
export class AppModule { }
