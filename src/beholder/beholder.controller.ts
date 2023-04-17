import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { MemoryService } from '../memory/memory.service';
import { BeholderService } from './beholder.service';

@ApiBearerAuth('token')
@ApiTags('Beholder')
@Controller('beholder')
export class BeholderController {
  constructor(
    private readonly beholderService: BeholderService,
    private readonly memoryService: MemoryService,
  ) {}

  @Get('/memory/indexes')
  @ApiOperation({ summary: 'Get the available memory indexes.' })
  @ApiResponse({
    status: 200,
    description: 'Los índices de memoria disponibles',
    type: [String],
  })
  getMemoryIndexes() {
    return this.beholderService.getMemoryIndexes();
  }

  @Get('/memory/:symbol?/:index?/:interval?')
  @ApiOperation({
    summary: 'Get the memory of a symbol in a specific index and interval',
  })
  @ApiParam({
    name: 'symbol',
    required: false,
    description: 'The symbol of the memory to retrieve.',
  })
  @ApiParam({
    name: 'index',
    required: false,
    description: 'The index of the memory to retrieve.',
  })
  @ApiParam({
    name: 'interval',
    required: false,
    description: 'The interval of the memory to retrieve.',
  })
  @ApiOkResponse({
    description: 'The memory of the symbol in the specific index and interval.',
    type: Object,
  })
  getMemory(
    @Param('symbol') symbol?: string,
    @Param('index') index?: string,
    @Param('interval') interval?: string,
  ) {
    return this.memoryService.getMemory(symbol, index, interval);
  }

  @Get('/brain/indexes')
  @ApiOperation({ summary: 'Get the available brain indexes.' })
  @ApiResponse({
    status: 200,
    description: 'The available brain indexes',
    type: [String],
  })
  getBrainIndexes() {
    return this.beholderService.getBrainIndexes();
  }

  @Get('/brain')
  @ApiOperation({ summary: 'Get the complete content of brain.' })
  @ApiResponse({
    status: 200,
    description: 'El contenido completo de brain',
    type: Object,
  })
  getBrain() {
    return this.beholderService.getBrain();
  }

  @Get('/analysis')
  @ApiOperation({ summary: 'Get the analysis index.' })
  @ApiResponse({
    status: 200,
    description: 'El índice de análisis',
    type: String,
  })
  getAnalysisIndex() {
    return this.beholderService.getAnalysisIndex();
  }
}
