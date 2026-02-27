import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreditCardRepository } from '../repositories/credit-card.repository';
import { CREDIT_CARD_ERRORS } from '../constants/credit-card.errors';

@Injectable()
export class FindByIdCreditCardUseCase {
  constructor(
    @Inject('CreditCardRepository')
    private readonly repository: CreditCardRepository,
  ) {}

  async execute(id: string, userId: string) {
    const expense = await this.repository.findById(id, userId);

    if (!expense) {
      throw new NotFoundException(CREDIT_CARD_ERRORS.NOT_FOUND);
    }

    return expense;
  }
}
