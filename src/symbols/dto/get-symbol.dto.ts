import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetSymbolDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  base?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  quote?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  onlyFavorites?: string;
}
