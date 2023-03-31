import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetSymbolDto {
    @IsOptional()
    @IsString()
    base?: string;

    @IsOptional()
    @IsString()
    quote?: string;

    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsString()
    onlyFavorites?: string
}
