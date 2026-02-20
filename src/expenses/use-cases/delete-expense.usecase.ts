import { EXPENSE_ERRORS } from '../constants/expense.errors';
import { EXPENSE_SUCCESSFULLY_CANCELED } from 'src/shared/constants';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from '../repositories/expense.repository';

@Injectable()
export class DeleteExpenseUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly repository: ExpenseRepository,
  ) {}

  async execute(id: string, userId: string) {
    const expense = await this.repository.softDelete(id, userId);

    if (!expense) {
      throw new NotFoundException(EXPENSE_ERRORS.NOT_FOUND);
    }

    return {
      message: EXPENSE_SUCCESSFULLY_CANCELED,
      data: {
        id: expense.id,
        status: expense.status,
        deletedAt: expense.deletedAt,
      },
    };
  }
}
