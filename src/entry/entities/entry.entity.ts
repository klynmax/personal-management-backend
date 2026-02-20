import { AccountType } from 'src/enum/entry.enum';

export interface EntryInterface {
  id: string;
  bank: string;
  userId: string;
  amount: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  deletedAt: Date | null;
  accountType: AccountType;
  description: string | undefined;
}
