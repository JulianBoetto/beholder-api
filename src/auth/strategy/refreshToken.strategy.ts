import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.jwt_refresh_token_secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refresh_token = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refresh_token };
  }
}