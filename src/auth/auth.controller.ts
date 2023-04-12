import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LoginDto, LoginRtaDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthRequest } from './models/AuthRequest';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LoginRtaDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Email address or password provided is incorrect'
  })
  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: AuthRequest) {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Request() req: AuthRequest) {
    const userId = req.user['sub'];
    const refresh_token = req.user['refresh_token'];
    return this.authService.refreshTokens(userId, refresh_token);
  }
}
