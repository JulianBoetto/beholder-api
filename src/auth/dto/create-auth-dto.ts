import { IsNumber, IsString } from "class-validator";
import { Auth } from "../entities/auth.entity";

export class CreateAuthDto extends Auth {
    @IsNumber()
    userId: number;

    @IsString()
    refreshToken: string;
}