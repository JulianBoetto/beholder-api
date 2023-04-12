import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@ApiBearerAuth('token')
@ApiTags('Automations')
@Controller('automations')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get(':id')
  getAutomation(@Param('id') id: string) {
    return this.automationsService.getAutomation(id);
  }

  @Get()
  getAutomations() {
    return this.automationsService.getAutomations();
  }

  @Post(':id/start')
  startAutomation(@Param('id') id: string) {
    return this.automationsService.startAutomation(id);
  }

  @Post(':id/stop')
  stopAutomation(@Param('id') id: string) {
    return this.automationsService.stopAutomation(id);
  }

  @Post()
  insertAutomation(@Body() newAutomation: CreateAutomationDto) {
    return this.automationsService.insertAutomation(newAutomation);
  }

  @Patch(':id')
  updateAutomation(
    @Param('id') id: string,
    @Body() updatesBody: UpdateAutomationDto,
  ) {
    return this.automationsService.updateAutomation(id, updatesBody);
  }

  @Delete(':id')
  deleteAutomation(@Param('id') id: string) {
    return this.automationsService.deleteAutomation(id);
  }
}
