import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [UserModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: "24h" }
  })],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule { }
