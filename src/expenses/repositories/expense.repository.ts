import { Expense } from '../entities/expense.entity';
import { MonthlySummary } from '../entities/monthly-summary';
import { UpdateExpensesDTO } from '../dtos/update-expenses.dto';
import { PaginatedResult } from 'src/interfaces/IPaginatedResult';
import { CreateExpenseInput } from '../entities/create-expense.entity';
import { UpdateExpenseInput } from '../entities/update-expense.entity';

export interface ExpenseRepository {
  create(data: CreateExpenseInput): Promise<Expense>;
  findById(id: string, userId: string): Promise<Expense | null>;
  update(
    id: string,
    userId: string,
    data: UpdateExpenseInput,
  ): Promise<UpdateExpensesDTO | null>;
  findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Expense>>;
  softDelete(id: string, userId: string): Promise<Expense | null>;
  getMonthlySummary(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlySummary>;
}
