import { CreditCardDocument } from './credit-card.schema';

export class CreditCardMapper {
  static toDomain(document: CreditCardDocument) {
    return {
      id: document.id,
      name: document.name,
      limit: document.limit,
      brand: document.brand,
      dueDay: document.dueDay,
      userId: document.userId,
      surname: document.surname,
      deleted: document.deleted,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      deletedAt: document.deletedAt ?? null,
      closingDay: document.closingDay,
      bestPurchaseDay: document.bestPurchaseDay,
    };
  }
}
