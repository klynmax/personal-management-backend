import { ApiProperty } from '@nestjs/swagger';

export class BestCardForPurchaseDto {
  @ApiProperty({
    example: '5a849c48-9be3-4d65-99df-98029ec846f9',
    description: 'ID do cartão considerado o melhor para compra no momento',
  })
  id: string;

  @ApiProperty({
    example: 'Nubank',
    description: 'Nome do cartão',
  })
  name: string;

  @ApiProperty({
    example: 'Final 1234',
    description: 'Identificador visual do cartão',
  })
  surname: string;

  @ApiProperty({
    example: 10,
    description:
      'Dia ideal de compra. Compras feitas a partir desse dia caem na fatura do próximo mês',
  })
  bestPurchaseDay: number;
}

export class CreditCardSummaryDto {
  @ApiProperty({
    example: 2,
    description: 'Quantidade total de cartões de crédito ativos',
  })
  totalCards: number;

  @ApiProperty({
    example: 12000,
    description: 'Soma do limite total de todos os cartões ativos',
  })
  totalLimit: number;

  @ApiProperty({
    example: '27/02/2026 - Final 1234',
    nullable: true,
    description:
      'Próxima data de vencimento considerando todos os cartões ativos, no formato DD/MM/YYYY - Apelido do cartão',
  })
  nextDue: string | null;

  @ApiProperty({
    type: BestCardForPurchaseDto,
    nullable: true,
    description:
      'Cartão mais vantajoso para compras no momento, considerando a melhor data de compra',
  })
  bestCardForPurchase: BestCardForPurchaseDto | null;
}
