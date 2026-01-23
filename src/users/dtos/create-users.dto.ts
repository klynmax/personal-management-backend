import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { LevelUsersType, StatusUsersType } from 'src/enum/users.enum';

export class CreateUsersDTO {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
    minLength: 2,
  })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'E-mail do usuário',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  @ApiProperty({
    example: 'Senha@123',
    description: 'Senha do usuário',
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Senha deve conter letra maiúscula, minúscula e número',
  })
  password: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Telefone do usuário',
  })
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Telefone inválido',
  })
  phone: string;

  @ApiProperty({
    enum: LevelUsersType,
    description: 'Nível de acesso do usuário',
  })
  @IsNotEmpty()
  @IsEnum(LevelUsersType, {
    message: 'O nível do usuário informado é inválido',
  })
  level: LevelUsersType;

  @ApiPropertyOptional({
    enum: StatusUsersType,
    description: 'Status do usuário',
  })
  @IsEnum(StatusUsersType, {
    message: 'O status informado é inválido',
  })
  @IsOptional()
  status?: StatusUsersType;
}
