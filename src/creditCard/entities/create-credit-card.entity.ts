import { BrandCard } from 'src/enum/creditCard.enum';

export interface CreateCreditCardInput {
  name: string;
  limit: number;
  dueDay: number;
  userId: string;
  surname: string;
  brand: BrandCard;
  closingDay: number;
  bestPurchaseDay: number;
}
