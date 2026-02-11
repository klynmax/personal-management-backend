import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MeResponseDTO } from './dto/me-response.dto';
import { UsersServices } from 'src/users/users.service';
import { AuthResponseDTO } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersServices,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponseDTO> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciais inválidas');

    return this.generateTokens(user._id, user.email);
  }

  generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refresh(
    userId: string,
    email: string,
    refreshToken: string,
  ): Promise<AuthResponseDTO> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) throw new UnauthorizedException();

    return this.generateTokens(user._id, user.email);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logout realizado com sucesso' };
  }

  async me(userId: string): Promise<MeResponseDTO> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      level: user.level,
      phone: user.phone,
    };
  }
}
