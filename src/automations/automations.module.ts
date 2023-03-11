import { Module } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { AutomationsController } from './automations.controller';
import { BeholderModule } from 'src/beholder/beholder.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [BeholderModule, PrismaModule],
  controllers: [AutomationsController],
  providers: [AutomationsService]
})
export class AutomationsModule {}
