export interface CreditCardMonthlySummary {
  totalCards: number;
  totalLimit: number;
  nextDue: string;
  bestCardForPurchase: {
    id: string;
    name: string;
    surname: string;
    bestPurchaseDay: string;
  };
}
