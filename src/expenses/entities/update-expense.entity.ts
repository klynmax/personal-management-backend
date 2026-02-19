import { PaymentType, StatusExpense } from 'src/enum/expenses.enum';

export interface UpdateExpenseInput {
  amount?: number;
  category?: string;
  description?: string;
  status?: StatusExpense;
  paymentType?: PaymentType;
}
