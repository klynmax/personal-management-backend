import {
  IsEnum,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType, StatusExpense } from 'src/enum/expenses.enum';

export class CreateExpensesDTO {
  @ApiProperty({
    example: 'b3f1a2c4-9c8e-4c6d-a123-98ab12ef4567',
    description: 'ID do usuário dono da despesa',
  })
  @IsNotEmpty()
  @IsString()
  userId: string; // TEMPORÁRIO enquanto não tem auth

  @ApiProperty({
    example: 'Alimentação',
    description: 'Categoria da despesa',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: 125.5,
    description: 'Valor da despesa',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'O valor deve ser maior que zero' })
  amount: number;

  @ApiPropertyOptional({
    example: 'Almoço no restaurante',
    description: 'Descrição da despesa',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: PaymentType,
    description: 'Tipo de pagamento',
  })
  @IsNotEmpty()
  @IsEnum(PaymentType, {
    message: 'Tipo de pagamento inválido',
  })
  paymentType: PaymentType;

  @ApiPropertyOptional({
    enum: StatusExpense,
    description: 'Status da despesa',
    default: StatusExpense.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StatusExpense, {
    message: 'Status da despesa inválido',
  })
  status?: StatusExpense;
}
