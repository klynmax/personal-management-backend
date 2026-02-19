import { EXPENSE_ERRORS } from '../constants/expense.errors';
import { UpdateExpensesDTO } from '../dtos/update-expenses.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from '../repositories/expense.repository';

@Injectable()
export class UpdateExpenseUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly repository: ExpenseRepository,
  ) {}

  async execute(id: string, userId: string, data: UpdateExpensesDTO) {
    const expense = await this.repository.update(id, userId, data);

    if (!expense) {
      throw new NotFoundException(EXPENSE_ERRORS.NOT_FOUND);
    }

    return expense;
  }
}
