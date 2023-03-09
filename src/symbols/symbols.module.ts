import { Module } from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { SymbolsController } from './symbols.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SymbolsController],
  providers: [SymbolsService]
})
export class SymbolsModule {}
