import {
  Min,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class CreateExpenseCardDto {
  @ApiProperty({
    example: '43e9aec1-b811-448b-b3c2-75a6b8a34f24',
    description: 'ID do cartão de crédito vinculado à despesa',
  })
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @ApiProperty({
    example: 'Alimentação',
    description: 'Categoria da despesa',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'Supermercado',
    required: false,
    description: 'Descrição complementar da despesa',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 6,
    description: 'Quantidade total de parcelas da despesa',
  })
  @IsNumber()
  @Min(1)
  totalInstallments: number;

  @ApiProperty({
    example: 1200.5,
    description: 'Valor total da compra',
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: '2026-08-10',
    description:
      'Data da última parcela da despesa (data de finalização da compra)',
  })
  @IsDateString()
  endDate: Date;
}
