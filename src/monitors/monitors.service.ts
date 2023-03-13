import { Injectable } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

@Injectable()
export class MonitorsService {
  create(createMonitorDto: CreateMonitorDto) {
    return 'This action adds a new monitor';
  }

  findAll() {
    return `This action returns all monitors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monitor`;
  }

  update(id: number, updateMonitorDto: UpdateMonitorDto) {
    return `This action updates a #${id} monitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitor`;
  }
}

export const monitorTypes = {
  MINI_TICKER: 'MINI_TICKER',
  BOOK: 'BOOK',
  USER_DATA: 'USER_DATA',
  CANDLES: 'CANDLES',
  TICKER: 'TICKER',
};
