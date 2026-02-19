import { Inject, Injectable } from '@nestjs/common';
import { Expense } from '../entities/expense.entity';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CreateExpenseInput } from '../entities/create-expense.entity';

@Injectable()
export class CreateExpenseUseCase {
  constructor(
    @Inject('ExpenseRepository')
    private readonly repository: ExpenseRepository,
  ) {}

  async execute(data: CreateExpenseInput): Promise<Expense> {
    return this.repository.create(data);
  }
}
