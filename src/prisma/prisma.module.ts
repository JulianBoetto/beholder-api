import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MonitorsModule } from 'src/monitors/monitors.module';

@Module({
  imports: [MonitorsModule],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
