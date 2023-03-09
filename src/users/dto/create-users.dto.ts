import { User } from '../entities/user.entity';
import {
    IsDate,
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUsersDto extends User {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;

    @IsString()
    apiUrl?: string;

    @IsString()
    accessKey?: string;

    @IsString()
    secretKey?: string;

    @IsString()
    streamUrl?: string;

    @IsString()
    phone?: string;

    @IsString()
    sendGridKey?: string;

    @IsString()
    twilioSid?: string;

    @IsString()
    twilioToken?: string;

    @IsString()
    twilioPhone?: string;

    @IsString()
    telegramBot?: string;

    @IsString()
    telegramChat?: string;

    @IsString()
    pushToken?: string;

    @IsDate()
    createdAt?: Date;

    @IsDate()
    updatedAt?: Date;
}