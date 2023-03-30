import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BeholderService } from '../beholder/beholder.service';
import { MonitorsService } from '../monitors/monitors.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class AutomationsService implements OnModuleInit {
  @Inject('winston') private logger: Logger;

  constructor(
    private monitorsService: MonitorsService,
    private beholder: BeholderService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
      this.logger.info('Initializing the Beholder Brain...');
      this.getActiveAutomations().then((automations) => {
        this.beholder.init(automations);
        this.monitorsService.init();
      });
    }
  }

  async getActiveAutomations() {
    const automations = await this.prisma.automation.findMany({
      where: { isActive: true },
      include: { grid: true, action: { include: { orderTemplate: true } } },
    });
    return automations;
  }
}
