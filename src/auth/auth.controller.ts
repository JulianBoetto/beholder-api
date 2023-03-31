import { Controller, Delete, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthRequest } from './models/AuthRequest';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Request() req: AuthRequest) {
        return this.authService.login(req.user);
    }

    @Delete("logout")
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