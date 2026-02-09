import { ApiProperty } from '@nestjs/swagger';

export class MonthlyEntrySummaryDto {
  @ApiProperty({
    example: 1500,
    description: 'Saldo total de entradas do mês corrente',
  })
  saldo: number;

  @ApiProperty({
    example: 3,
    description: 'Quantidade total de entradas no mês corrente',
  })
  totalEntradas: number;

  @ApiProperty({
    example: '2026-02-08T12:28:11.045Z',
    nullable: true,
    description: 'Data da última entrada do mês corrente',
  })
  ultimaEntrada: Date | null;
}
