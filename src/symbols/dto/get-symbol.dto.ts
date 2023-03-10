import { IsOptional, IsString } from "class-validator";

export class GetSymbolDto {
    @IsOptional()
    @IsString()
    base?: string;

    @IsOptional()
    @IsString()
    quote?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    onlyFavorites?: string
}
