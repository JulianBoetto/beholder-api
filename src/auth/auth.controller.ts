import { Controller, Delete, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthRequest } from './models/AuthRequest';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @IsPublic()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    login(@Request() req: AuthRequest) {
        return this.authService.login(req.user);
    }

    @Delete("logout")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    logout(@Request() req: AuthRequest) {
        const userId = req.user['sub'];
        return this.authService.logout(userId);
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    refreshTokens(@Request() req: AuthRequest) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
