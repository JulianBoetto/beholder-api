import { Test, TestingModule } from '@nestjs/testing';
import { AveragePricesService } from './average-prices.service';

describe('AveragePricesService', () => {
  let service: AveragePricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AveragePricesService],
    }).compile();

    service = module.get<AveragePricesService>(AveragePricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
