import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BeholderController } from './beholder.controller';
import { BeholderService } from './beholder.service';

@Module({
  imports: [UsersModule],
  controllers: [BeholderController],
  providers: [BeholderService],
  exports: [BeholderService],
})
export class BeholderModule {}
