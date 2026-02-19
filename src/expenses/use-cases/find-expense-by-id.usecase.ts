import { EXPENSE_ERRORS } from '../constants/expense.errors';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from '../repositories/expense.repository';

@Injectable()
export class FindExpenseByIdUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly repository: ExpenseRepository,
  ) {}

  async execute(id: string, userId: string) {
    const expense = await this.repository.findById(id, userId);

    if (!expense) {
      throw new NotFoundException(EXPENSE_ERRORS.NOT_FOUND);
    }

    return expense;
  }
}
