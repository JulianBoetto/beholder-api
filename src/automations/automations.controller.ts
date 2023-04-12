import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@ApiBearerAuth('token')
@ApiTags('Automations')
@Controller('automations')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get automation by ID.' })
  getAutomation(@Param('id') id: string) {
    return this.automationsService.getAutomation(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all automations.' })
  getAutomations() {
    return this.automationsService.getAutomations();
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Starts the execution of an automation by its ID.' })
  startAutomation(@Param('id') id: string) {
    return this.automationsService.startAutomation(id);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: 'Stops the execution of an automation by its ID.' })
  stopAutomation(@Param('id') id: string) {
    return this.automationsService.stopAutomation(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new automation.' })
  insertAutomation(@Body() newAutomation: CreateAutomationDto) {
    return this.automationsService.insertAutomation(newAutomation);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates the details of an existing automation by its ID.' })
  updateAutomation(
    @Param('id') id: string,
    @Body() updatesBody: UpdateAutomationDto,
  ) {
    return this.automationsService.updateAutomation(id, updatesBody);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes an automation by its ID.' })
  deleteAutomation(@Param('id') id: string) {
    return this.automationsService.deleteAutomation(id);
  }
}
