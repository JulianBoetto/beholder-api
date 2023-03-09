import { IsOptional, IsString } from "class-validator";

export class GetSymbolDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    onlyFavorites?: string
}
