import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  automationId?: number;

  @ApiProperty()
  @IsString()
  symbol: string;

  @ApiProperty()
  @IsNumber()
  orderId: number;

  @ApiProperty()
  @IsString()
  clientOrderId: string;

  @ApiProperty()
  @Transform(({ value }) => value.toString())
  transactTime: BigInt;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  side: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isMaker: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  limitPrice: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stopPrice: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avgPrice: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commission: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  net: string;

  @ApiProperty()
  @IsString()
  quantity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icebergQty: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  obs: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
