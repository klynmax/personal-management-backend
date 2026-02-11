import {
  Req,
  Res,
  Get,
  Body,
  Post,
  UseGuards,
  Controller,
  UnauthorizedException,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import IJwtPayload from 'src/interfaces/IJwtPayload';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto.email, dto.password);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { ok: true };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as { sub: string; email: string };
    const refreshToken = req.cookies?.refreshToken as string;
    if (!refreshToken) throw new UnauthorizedException();

    const tokens = await this.authService.refresh(
      user.sub,
      user.email,
      refreshToken,
    );

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { ok: true };
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  //   const user = req.user as { sub: string };
  //   await this.authService.logout(user.sub);

  //   res.clearCookie('accessToken', { path: '/' });
  //   res.clearCookie('refreshToken', { path: '/' });

  //   return { ok: true };
  // }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as { sub?: string };

    // limpa cookies SEMPRE
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    // se houver usuário, revoga refresh no banco
    if (user?.sub) {
      await this.authService.logout(user.sub);
    }

    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Dados do usuário autenticado',
    schema: {
      example: {
        id: '65cfa2d7e7f1b2a9c4e9a123',
        name: 'João Pedro',
        email: 'joao@email.com',
        level: 'admin',
        phone: '11999999999',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  async me(@Req() req: Request) {
    const user = req.user as IJwtPayload;
    return this.authService.me(user.sub);
  }
}
