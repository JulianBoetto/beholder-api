import { PartialType } from '@nestjs/mapped-types';
import { CreateExchangeMonitorDto } from './create-exchange-monitor.dto';

export class UpdateExchangeMonitorDto extends PartialType(CreateExchangeMonitorDto) {}
