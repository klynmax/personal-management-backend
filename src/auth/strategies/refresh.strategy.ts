import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import type { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não definido');

    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: (req: Request) =>
        (req?.cookies?.accessToken as string) || null,
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    };

    super(options);
  }

  validate(payload: JwtPayload) {
    return { sub: payload.sub, email: payload.email };
  }
}
