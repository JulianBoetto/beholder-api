import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import { Automation } from "../entities/automation.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAutomationDto extends Automation {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    symbol: string;

    @ApiProperty()
    @IsString()
    indexes: string;

    @ApiProperty()
    @IsString()
    conditions: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    schedule?: string;

    @ApiProperty()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty()
    @IsBoolean()
    logs: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDate()
    createdAt?: Date;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}
