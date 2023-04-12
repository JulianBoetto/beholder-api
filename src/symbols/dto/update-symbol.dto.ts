import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSymbolDto {
  @ApiProperty({ type: String })
  @IsString()
  symbol: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  basePrecision: number;

  @ApiProperty({ type: String })
  @IsString()
  base: string;

  @ApiProperty({ type: String })
  @IsString()
  quote: string;

  @ApiProperty({ type: String })
  @IsString()
  stepSize: string;

  @ApiProperty({ type: String })
  @IsString()
  tickSize: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  quotePrecision: number;

  @ApiProperty({ type: String })
  @IsString()
  minNotional: string;

  @ApiProperty({ type: String })
  @IsString()
  minLotSize: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
