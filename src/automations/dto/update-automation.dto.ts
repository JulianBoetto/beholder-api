import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAutomationDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    conditions: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    schedule?: string;
}
