import { BrandCard } from 'src/enum/creditCard.enum';

export interface CreditCardEntity {
  id: string;
  name: string;
  limit: number;
  dueDay: number;
  userId: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;
  brand: BrandCard;
  deleted: boolean;
  closingDay: number;
  deletedAt: Date | null;
  bestPurchaseDay: number;
}
