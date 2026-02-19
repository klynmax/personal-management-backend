import { PaymentType, StatusExpense } from 'src/enum/expenses.enum';

export interface CreateExpenseInput {
  userId: string;
  amount: number;
  category: string;
  description?: string;
  status?: StatusExpense;
  paymentType: PaymentType;
}
