import { AccountType } from 'src/enum/entry.enum';

export interface CreateEntryInput {
  bank: string;
  amount: number;
  source: string;
  userId: string;
  description?: string;
  accountType: AccountType;
}
