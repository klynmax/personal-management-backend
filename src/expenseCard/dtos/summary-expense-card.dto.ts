import { ApiProperty } from '@nestjs/swagger';

export class ExpenseCardSummaryDto {
  @ApiProperty({
    example: 3850,
    description: 'Total de despesas do mês atual',
  })
  totalMonth: number;

  @ApiProperty({
    example: 8200,
    description: 'Total de despesas em aberto',
  })
  totalOpen: number;

  @ApiProperty({
    example: '2026-05-20T03:00:00.000Z',
    nullable: true,
    description: 'Próxima data de vencimento',
  })
  nextDueDate: string | null;

  @ApiProperty({
    example: 12,
    description: 'Quantidade de parcelas ativas',
  })
  activeInstallments: number;
}
