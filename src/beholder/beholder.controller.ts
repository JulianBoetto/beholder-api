import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BeholderService } from './beholder.service';
import { CreateBeholderDto } from './dto/create-beholder.dto';
import { UpdateBeholderDto } from './dto/update-beholder.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Beholder')
@Controller('beholder')
export class BeholderController {
  constructor(private readonly beholderService: BeholderService) {}

  @ApiOperation({ summary: 'Obtener los índices de memoria disponibles' })
  @Get('/memory/indexes')
  @ApiResponse({
    status: 200,
    description: 'Los índices de memoria disponibles',
    type: [String],
  })
  getMemoryIndexes() {
    return this.beholderService.getMemoryIndexes();
  }
  @ApiOperation({
    summary:
      'Obtener la memoria de un símbolo en un índice y un intervalo específico',
  })
  @ApiQuery({
    name: 'symbol',
    required: false,
    description: 'El símbolo de la memoria a obtener',
  })
  @ApiQuery({
    name: 'index',
    required: false,
    description: 'El índice de la memoria a obtener',
  })
  @ApiQuery({
    name: 'interval',
    required: false,
    description: 'El intervalo de la memoria a obtener',
  })
  @ApiOkResponse({
    description:
      'La memoria del símbolo en el índice y el intervalo específicos',
    type: Object,
  })
  getMemory(
    @Query('symbol') symbol: string,
    @Query('index') index: string,
    @Query('interval') interval: string,
  ) {
    return this.beholderService.getMemory(symbol, index, interval);
  }

  @ApiOperation({ summary: 'Obtener los índices de brain disponibles' })
  @Get('/brain/indexes')
  @ApiResponse({
    status: 200,
    description: 'Los índices de brain disponibles',
    type: [String],
  })
  getBrainIndexes() {
    return this.beholderService.getBrainIndexes();
  }

  @ApiOperation({ summary: 'Obtener el contenido completo de brain' })
  @Get('/brain')
  @ApiResponse({
    status: 200,
    description: 'El contenido completo de brain',
    type: Object,
  })
  getBrain() {
    return this.beholderService.getBrain();
  }

  @ApiOperation({ summary: 'Obtener el índice de análisis' })
  @Get('/analysis')
  @ApiResponse({
    status: 200,
    description: 'El índice de análisis',
    type: String,
  })
  getAnalysisIndex() {
    return this.beholderService.getAnalysisIndex();
  }
}
