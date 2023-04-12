import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 4, maxLength: 20, example: 'Passw0rd!' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiPropertyOptional({ example: 'https://api.example.com' })
  @IsString()
  apiUrl?: string;

  @ApiPropertyOptional({ example: 'ACCESS_KEY' })
  @IsString()
  accessKey?: string;

  @ApiPropertyOptional({ example: 'SECRET_KEY' })
  @IsString()
  secretKey?: string;

  @ApiPropertyOptional({ example: 'https://stream.example.com' })
  @IsString()
  streamUrl?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'SENDGRID_API_KEY' })
  @IsString()
  sendGridKey?: string;

  @ApiPropertyOptional({ example: 'TWILIO_SID' })
  @IsString()
  twilioSid?: string;

  @ApiPropertyOptional({ example: 'TWILIO_TOKEN' })
  @IsString()
  twilioToken?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  twilioPhone?: string;

  @ApiPropertyOptional({ example: 'TELEGRAM_BOT_TOKEN' })
  @IsString()
  telegramBot?: string;

  @ApiPropertyOptional({ example: 'TELEGRAM_CHAT_ID' })
  @IsString()
  telegramChat?: string;

  @ApiPropertyOptional({ example: 'PUSH_TOKEN' })
  @IsString()
  pushToken?: string;

  @ApiPropertyOptional({ example: '2023-04-01T15:30:00.000Z' })
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional({ example: '2023-04-01T15:30:00.000Z' })
  @IsDate()
  updatedAt?: Date;
}
