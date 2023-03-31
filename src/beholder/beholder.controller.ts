import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BeholderService } from './beholder.service';
import { CreateBeholderDto } from './dto/create-beholder.dto';
import { UpdateBeholderDto } from './dto/update-beholder.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Beholder')
@Controller('beholder')
export class BeholderController {
  constructor(private readonly beholderService: BeholderService) { }

  @Get('/memory/indexes')
  getMemoryIndexes() {
    return this.beholderService.getMemoryIndexes();
  }
  // get('/memory/indexes', getMemoryIndexes);

  // get('/memory/:symbol?/:index?/:interval?', getMemory);

  // get('/brain/indexes', getBrainIndexes);

  // get('/brain', getBrain);

  // get('/analysis', getAnalysisIndex);

  // get('/agenda', getAgenda);
  // @Post()
  // create(@Body() createBeholderDto: CreateBeholderDto) {
  //   return this.beholderService.create(createBeholderDto);
  // }



  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.beholderService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBeholderDto: UpdateBeholderDto) {
  //   return this.beholderService.update(+id, updateBeholderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.beholderService.remove(+id);
  // }
}
