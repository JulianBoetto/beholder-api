import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { encryptData } from 'src/utils/encrypt';
import { CreateAuthDto } from './dto/create-auth-dto';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserFromJwt } from './models/UserFromJwt';
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
        return this.prisma.auth.findUnique({ where: { userId } });
    }

    async login(user: User): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email
        };

        const { pushToken } = await this.userService.findByEmail(user.email)
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: "15m"
        })
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: "24h"
        })

        await this.updateRefreshToken({ userId: user.id, refreshToken });

        return {
            accessToken,
            refreshToken,
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

    async logout(req: User) {
        await this.prisma.auth.update({ where: { userId: req.id }, data: { refreshToken: "" } })
        return
    }

    async updateRefreshToken(auth: CreateAuthDto) {
        const encryptRefreshToken = await encryptData(auth.refreshToken);
        const authExist = await this.findByUserId(auth.userId)
        if (authExist) {
            await this.prisma.auth.update({ where: { userId: auth.userId }, data: { refreshToken: auth.refreshToken } })
        } else await this.prisma.auth.create({ data: { refreshToken: encryptRefreshToken, userId: auth.userId } });
    }
}