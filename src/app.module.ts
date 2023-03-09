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
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, WinstonModule.forRoot(winstonConfig),],
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
