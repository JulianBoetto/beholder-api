import { Module } from '@nestjs/common';
import { BeholderService } from './beholder.service';
import { BeholderController } from './beholder.controller';
import { AutomationsModule } from 'src/automations/automations.module';

@Module({
  controllers: [BeholderController],
  providers: [BeholderService],
  exports: [BeholderService],
})
export class BeholderModule {}
