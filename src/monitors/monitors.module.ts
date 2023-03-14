import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SettingsModule } from 'src/settings/settings.module';
import { UsersModule } from 'src/users/users.module';
import { MonitorsController } from './monitors.controller';
import { MonitorsService } from './monitors.service';
import { ExchangeModule } from 'src/exchange/exchange.module';
import { BeholderModule } from 'src/beholder/beholder.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SettingsModule,
    ExchangeModule,
    BeholderModule,
  ],
  controllers: [MonitorsController],
  providers: [MonitorsService],
})
export class MonitorsModule {}
