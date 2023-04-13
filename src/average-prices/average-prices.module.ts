import { Module } from '@nestjs/common';
import { AveragePricesService } from './average-prices.service';

@Module({
  providers: [AveragePricesService]
})
export class AveragePricesModule {}
