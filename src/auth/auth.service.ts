import { ForbiddenException, Injectable, Next, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { encryptData } from 'src/utils/encrypt';
import { Auth } from './entities/auth.entity';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    findByUserId(userId: number) {
        return this.userService.findById(userId);
    }

    async login(user: User): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id
        };

        const { pushToken } = await this.userService.findById(user.id)
        const accessToken = await this.getAccessToken(payload)
        const refreshToken = await this.getRefreshToken(payload)

        await this.updateRefreshToken({ userId: user.id, refreshToken });

        return {
            accessToken,
            refreshToken,
            pushToken,
        };
    }

    async getAccessToken(payload: object) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
        })
        return accessToken
    }

    async getRefreshToken(payload: object) {
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
        })
        return refreshToken
    }


    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

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
            await this.userService.update(id, { refreshToken: "" })
        }
        return
    }

    async updateRefreshToken(auth: Auth) {
        const encryptRefreshToken = await encryptData(auth.refreshToken);
        const { refreshToken } = await this.findByUserId(auth.userId)
        if (refreshToken) {
            await this.userService.update(auth.userId, { refreshToken: auth.refreshToken })
        } else await this.userService.create({ refreshToken: encryptRefreshToken, userId: auth.userId });
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.getUserIfRefreshTokenMatches(refreshToken, userId);
        if (!user || !user.refreshToken)
            throw new UnauthorizedException();


        // LOGIN RETURN TOKENS
        // const tokens = await this.userService.findById(user.id);
        // await this.updateRefreshToken(user.id, tokens.refreshToken);
        // return tokens;
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.userService.findById(userId);

        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.refreshToken
        );

        if (isRefreshTokenMatching) {
            return user;
        }
    }
}