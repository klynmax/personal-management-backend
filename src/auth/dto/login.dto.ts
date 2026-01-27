import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Senha@123',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'A senha deve ter no mínimo 8 caracteres',
  })
  password: string;
}
