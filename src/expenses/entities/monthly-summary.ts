export interface MonthlySummary {
  totalDebit: number;
  totalAmount: number;
  totalVoucher: number;
  totalExpenses: number;
  lastPurchaseDate: Date | null;
}
