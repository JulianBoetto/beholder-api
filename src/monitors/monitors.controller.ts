import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MonitorsService } from './monitors.service';
import { Monitor } from './entities/monitor.entity';

@ApiBearerAuth('token')
@ApiTags('Monitors')
@Controller('monitors')
export class MonitorsController {
  constructor(private readonly monitorsService: MonitorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all monitors.' })
  @ApiResponse({ status: 200, description: 'Returns an array of monitors.' })
  async getMonitors(): Promise<Monitor[]> {
    return this.monitorsService.getMonitors();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a monitor by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the monitor.' })
  @ApiResponse({ status: 200, description: 'Returns a monitor.' })
  async getMonitor(@Param('id') id: string): Promise<Monitor> {
    return this.monitorsService.getMonitor(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new monitor.' })
  @ApiResponse({ status: 201, description: 'Creates a monitor.' })
  async insertMonitor(@Body() monitorDto: Monitor): Promise<void> {
    return this.monitorsService.insertMonitor(monitorDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a monitor by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the monitor.' })
  @ApiResponse({ status: 204, description: 'Updates a monitor.' })
  async updateMonitor(
    @Param('id') id: string,
    @Body() monitorDto: Monitor,
  ): Promise<void> {
    return this.monitorsService.updateMonitor(id, monitorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a monitor by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the monitor.' })
  @ApiResponse({ status: 204, description: 'Deletes a monitor.' })
  async deleteMonitor(@Param('id') id: string): Promise<void> {
    return this.monitorsService.deleteMonitor(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a monitor by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the monitor.' })
  @ApiResponse({ status: 204, description: 'Starts a monitor.' })
  async startMonitor(@Param('id') id: string): Promise<void> {
    return this.monitorsService.startMonitor(id);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: 'Stop a monitor by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the monitor.' })
  @ApiResponse({ status: 204, description: 'Stops a monitor.' })
  async stopMonitor(@Param('id') id: string): Promise<void> {
    return this.monitorsService.stopMonitor(id);
  }
}
