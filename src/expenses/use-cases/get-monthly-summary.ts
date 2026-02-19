import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../repositories/expense.repository';

@Injectable()
export class GetMonthlySummaryUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly repository: ExpenseRepository,
  ) {}

  async execute(userId: string) {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const summary = await this.repository.getMonthlySummary(
      userId,
      startOfMonth,
      endOfMonth,
    );

    return (
      summary ?? {
        totalAmount: 0,
        totalExpenses: 0,
        lastPurchaseDate: null,
        totalDebit: 0,
        totalVoucher: 0,
      }
    );
  }
}
