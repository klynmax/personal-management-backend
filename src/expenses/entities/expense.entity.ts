import { PaymentType, StatusExpense } from 'src/enum/expenses.enum';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  description?: string;
  status: StatusExpense;
  deletedAt: Date | null;
  paymentType: PaymentType;
}
