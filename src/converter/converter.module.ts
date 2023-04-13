import { Module } from '@nestjs/common';
import { ConverterService } from './converter.service';
import { ConverterController } from './converter.controller';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [MemoryModule],
  controllers: [ConverterController],
  providers: [ConverterService],
  exports: [ConverterService]
})
export class ConverterModule {}
