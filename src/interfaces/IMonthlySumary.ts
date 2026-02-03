export default interface MonthlySummary {
  totalAmount: number;
  totalExpenses: number;
  lastPurchaseDate: Date | null;
  totalDebit: number;
  totalVoucher: number;
}
