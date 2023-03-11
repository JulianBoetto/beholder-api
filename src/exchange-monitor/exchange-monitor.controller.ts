import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExchangeMonitorService } from './exchange-monitor.service';
import { CreateExchangeMonitorDto } from './dto/create-exchange-monitor.dto';
import { UpdateExchangeMonitorDto } from './dto/update-exchange-monitor.dto';

@Controller('exchange-monitor')
export class ExchangeMonitorController {
  constructor(private readonly exchangeMonitorService: ExchangeMonitorService) {}

}
