import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'winston';
import { BeholderService } from '../beholder/beholder.service';
import { MonitorsService } from '../monitors/monitors.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

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

  getAutomation(id: string) {
    // Logica para obtener una automatizacion por su id
  }

  getAutomations() {
    // Logica para obtener todas las automatizaciones
  }

  startAutomation(id: string) {
    // Logica para iniciar una automatizacion por su id
  }

  stopAutomation(id: string) {
    // Logica para detener una automatizacion por su id
  }

  insertAutomation(newAutomation: CreateAutomationDto) {
    // Logica para insertar una nueva automatizacion
  }

  updateAutomation(id: string, updatesBody: UpdateAutomationDto) {
    // Logica para actualizar una automatizacion por su id
  }

  deleteAutomation(id: string) {
    // Logica para eliminar una automatizacion por su id
  }
}
