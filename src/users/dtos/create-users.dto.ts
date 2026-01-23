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
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
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
  @IsEnum(LevelUsersType)
  level: LevelUsersType;

  @IsEnum(StatusUsersType)
  @IsOptional()
  status?: StatusUsersType;
}
