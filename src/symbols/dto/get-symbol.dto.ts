import { IsString } from "class-validator";

export class GetSymbolDto {
    @IsString()
    search?: string;

    @IsString()
    page?: string;

    @IsString()
    onlyFavorites?: string
}
