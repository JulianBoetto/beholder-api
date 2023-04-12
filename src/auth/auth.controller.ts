import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LoginDto, LoginRtaDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthRequest } from './models/AuthRequest';

@ApiBearerAuth('token')
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login and generate a new access token, refresh token and push token.' })
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

  @ApiOperation({ summary: 'Invalidate current access token.' })
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

  @ApiOperation({ summary: 'Generate a new tokens.' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LoginRtaDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Request() req: AuthRequest) {
    const userId = req.user['sub'];
    const refresh_token = req.user['refresh_token'];
    return this.authService.refreshTokens(userId, refresh_token);
  }
}
