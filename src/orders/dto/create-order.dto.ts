import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  automationId?: number;

  @IsString()
  symbol: string;
  @IsNumber()
  orderId: number;

  @IsString()
  clientOrderId: string;

  @IsNumber()
  transactTime: BigInt;

  @IsString()
  type: string;

  @IsString()
  side: string;

  @IsString()
  status: string;

  @IsBoolean()
  @IsOptional()
  isMaker: boolean;

  @IsString()
  @IsOptional()
  limitPrice: string;

  @IsOptional()
  @IsString()
  stopPrice: string;

  @IsString()
  @IsOptional()
  avgPrice: string;

  @IsOptional()
  @IsString()
  commission: string;

  @IsOptional()
  @IsString()
  net: string;

  @IsString()
  quantity: string;

  @IsOptional()
  @IsString()
  icebergQty: string;

  @IsOptional()
  @IsString()
  obs: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
