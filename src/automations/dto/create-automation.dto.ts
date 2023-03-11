import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import { Automation } from "../entities/automation.entity";

export class CreateAutomationDto extends Automation {
    @IsString()
    name: string;

    @IsString()
    symbol: string;

    @IsString()
    indexes: string;

    @IsString()
    conditions: string;

    @IsOptional()
    @IsString()
    schedule?: string;

    @IsBoolean()
    isActive: boolean;

    @IsBoolean()
    logs: boolean;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}
