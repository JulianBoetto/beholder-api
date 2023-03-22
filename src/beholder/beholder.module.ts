import { Module } from '@nestjs/common';
import { BeholderController } from './beholder.controller';
import { BeholderService } from './beholder.service';

@Module({
  controllers: [BeholderController],
  providers: [BeholderService],
  exports: [BeholderService],
})
export class BeholderModule {}
