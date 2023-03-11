import { Module } from '@nestjs/common';
import { ExchangeMonitorService } from './exchange-monitor.service';
import { ExchangeMonitorController } from './exchange-monitor.controller';

@Module({
  controllers: [ExchangeMonitorController],
  providers: [ExchangeMonitorService]
})
export class ExchangeMonitorModule {}
