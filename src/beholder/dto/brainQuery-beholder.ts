import { IsOptional, IsString } from 'class-validator';

export class BrainDTO {
  @IsOptional()
  @IsString()
  index?: string;
}