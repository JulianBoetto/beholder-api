import { Injectable, OnModuleInit } from '@nestjs/common';
import { BeholderService } from 'src/beholder/beholder.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@Injectable()
export class AutomationsService implements OnModuleInit {
  constructor(
    private readonly beholder: BeholderService,
    private readonly prisma: PrismaService
    ) {}
  onModuleInit() {
    this.getActiveAutomations().then(automations => this.beholder.init(automations));
  }

  async getActiveAutomations() {
    const automations = await this.prisma.automation.findMany();
    return automations;
  }
  
}
