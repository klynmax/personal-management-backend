import {
  IsEnum,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

import { Type } from 'class-transformer';
import { AccountType } from 'src/enum/entry.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEntryDTO {
  @ApiProperty({
    example: 'Banco do Brasil',
    description: 'Instituição financeira',
  })
  @IsString()
  @IsNotEmpty()
  bank: string;

  @ApiProperty({
    enum: AccountType,
    example: AccountType.CURRENT,
    description: 'Tipo da conta',
  })
  @IsEnum(AccountType, {
    message: 'O tipo informado é inválido',
  })
  accountType: AccountType;

  @ApiProperty({
    example: 125.5,
    description: 'Valor da entrada',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'O valor deve ser maior que zero' })
  amount: number;

  @ApiPropertyOptional({
    example: 'Décimo terceiro',
    description: 'Descrição adicional da entrada',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Salário',
    description: 'Origem da entrada (ex: salário, freelance, investimento)',
  })
  @IsString()
  @IsNotEmpty()
  source: string;
}
