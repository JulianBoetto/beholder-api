import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UnauthorizedError } from './errors/unauthorized.error';
import * as bcrypt from "bcrypt";
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { encryptData } from 'src/utils/encrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async login(user: User): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email
        };

        const { pushToken } = await this.userService.findByEmail(user.email)
        const access_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: "15m"
        })
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: "24h"
        })

        await this.updateRefreshToken(user.id, refresh_token);

        return {
            access_token,
            refresh_token,
            pushToken,
        };
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

    async logout(userId: string) {
        return this.userService.update(userId, { refreshToken: null });
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const encryptRefreshToken = await encryptData(refreshToken);
        await this.prisma.auth.create({ data: { refreshToken: encryptRefreshToken, userId } });
    }


}