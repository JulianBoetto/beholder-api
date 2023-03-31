import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Monitors')
@Controller('monitors')
export class MonitorsController {}
