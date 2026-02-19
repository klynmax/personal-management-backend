import { Expense } from '../entities/expense.entity';
import { ExpensesDocument } from 'src/schemas/expenses.schema';

export class ExpenseMapper {
  static toDomain(document: ExpensesDocument): Expense {
    return {
      id: document._id,
      userId: document.userId,
      amount: document.amount,
      status: document.status,
      category: document.category,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      description: document.description,
      paymentType: document.paymentType,
      deletedAt: document.deletedAt ?? null,
    };
  }
}
