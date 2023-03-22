import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { decryptData, encryptData } from 'src/utils/encrypt';
import { Auth } from './entities/auth.entity';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly settingsService: SettingsService
    ) { }

    findByUserId(userId: number) {
        return this.usersService.findById(userId);
    }

    async login(user: User): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email
        };

        const { pushToken } = await this.usersService.findById(user.id)
        const access_token = await this.getAccessToken(payload)
        const refresh_token = await this.getRefreshToken(payload)

        await this.updateRefreshToken({ userId: user.id, refresh_token });
        await this.settingsService.getSettingsDecrypted(user.id);
        this.usersService.setUserId(user.id);

        return {
            access_token,
            refresh_token,
            pushToken,
        };
    }

    async getAccessToken(payload: object) {
        const access_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
        })
        return access_token
    }

    async getRefreshToken(payload: object) {
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
        })
        return refresh_token
    }


    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                };
            }
        }

        throw new UnauthorizedError(
            'Email address or password provided is incorrect.',
        );
    }

    async logout(userId: number) {
        const { id, refreshToken } = await this.findByUserId(userId)
        if (refreshToken) {
            await this.usersService.update(id, { refreshToken: "" })
        }
        return
    }

    async updateRefreshToken(auth: Auth) {
        const encryptRefreshToken = await encryptData(auth.refresh_token);
        return await this.usersService.update(auth.userId, { refreshToken: encryptRefreshToken })
    }

    async refreshTokens(userId: number, refresh_token: string) {
        const user = await this.getUserIfRefreshTokenMatches(refresh_token, userId);
        if (!user || !user.refreshToken)
            throw new UnauthorizedException();

        const payload: UserPayload = {
            sub: user.id,
            email: user.email
        };

        const pushToken = user.pushToken;
        const access_token = await this.getAccessToken(payload);
        const newRefreshToken = await this.getRefreshToken(payload);
        await this.updateRefreshToken({ userId: user.id, refresh_token: newRefreshToken });
        return {
            access_token,
            refresh_token: newRefreshToken,
            pushToken
        };
    }

    async getUserIfRefreshTokenMatches(refresh_token: string, userId: number) {
        const user = await this.usersService.findById(userId);
        const decryptedRefreshToken = await decryptData(user.refreshToken);
        if (refresh_token === decryptedRefreshToken) return user
    }

    async verifyJwt(jwt: string): Promise<any> {
        return this.jwtService.verifyAsync(jwt);
    }
}