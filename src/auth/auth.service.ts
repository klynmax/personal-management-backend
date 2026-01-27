import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersServices } from 'src/users/users.service';
import { AuthResponseDTO } from './dto/auth-response.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersServices,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponseDTO> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateTokens(user._id, user.email);
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthResponseDTO> {
    const payload = { sub: userId, email };

    const [acessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    return { acessToken, refreshToken };
  }

  async refresh(userId: string, email: string): Promise<AuthResponseDTO> {
    return this.generateTokens(userId, email);
  }
}
