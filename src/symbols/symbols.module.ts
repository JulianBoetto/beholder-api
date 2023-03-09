import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SettingsModule } from 'src/settings/settings.module';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [SymbolsController],
  providers: [SymbolsService]
})
export class SymbolsModule { }
