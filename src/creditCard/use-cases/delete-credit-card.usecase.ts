import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreditCardRepository } from '../repositories/credit-card.repository';
import { CREDIT_CARD_ERRORS } from '../constants/credit-card.errors';
import { CREDIT_CARD_SUCCESSFULLY_CANCELED } from 'src/shared/constants';

@Injectable()
export class DeleteCreditCardUseCase {
  constructor(
    @Inject('CreditCardRepository')
    private readonly repository: CreditCardRepository,
  ) {}

  async execute(id: string, userId: string) {
    const creditCard = await this.repository.softDelete(id, userId);

    if (!creditCard) {
      throw new NotFoundException(CREDIT_CARD_ERRORS.NOT_FOUND);
    }

    return {
      message: CREDIT_CARD_SUCCESSFULLY_CANCELED,
      data: {
        name: creditCard.name,
        surname: creditCard.surname,
        deletedAt: creditCard.deletedAt,
      },
    };
  }
}
