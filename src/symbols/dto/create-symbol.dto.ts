import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSymbolDto {
    @IsString()
    symbol: string;

    @IsNumber()
    basePrecision: number;

    @IsString()
    base: string;

    @IsString()
    quote: string;

    @IsString()
    stepSize: string;
    
    @IsString()
    tickSize: string;

    @IsNumber()
    quotePrecision: number;

    @IsString()
    minNotional: string;

    @IsString()
    minLotSize: string;

    @IsOptional()
    @IsBoolean()
    isFavorite?: boolean;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;

    length: CreateSymbolDto;
}
