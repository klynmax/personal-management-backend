import { EntryDocument } from './entry.schema';
import { EntryInterface } from '../entities/entry.entity';

export class EntryMapper {
  static toDomain(document: EntryDocument): EntryInterface {
    return {
      id: document._id,
      bank: document.bank,
      userId: document.userId,
      amount: document.amount,
      source: document.source,
      deleted: document.deleted,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      deletedAt: document.deletedAt,
      description: document.description,
      accountType: document.accountType,
    };
  }
}
