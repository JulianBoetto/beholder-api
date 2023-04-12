import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional
} from 'class-validator';

export class UpdateSymbolDto {
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
