import { IsOptional, IsString, IsNumber } from 'class-validator';

export class MemoryQueryBeholderDTO {
  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsString()
  index?: string;

  @IsOptional()
  @IsNumber()
  interval?: number;
}