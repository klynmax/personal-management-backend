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
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Senha deve conter letra maiúscula, minúscula e número',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Telefone inválido',
  })
  phone: string;

  @IsNotEmpty()
  @IsEnum(LevelUsersType, {
    message: 'O nível do usuário informado é inválido',
  })
  level: LevelUsersType;

  @IsEnum(StatusUsersType, {
    message: 'O status informado é inválido',
  })
  @IsOptional()
  status?: StatusUsersType;
}
