import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreditCardRepository } from '../repositories/credit-card.repository';
import { UpdateCreditCardDto } from '../dtos/update-credit-card.dto';
import { CREDIT_CARD_ERRORS } from '../constants/credit-card.errors';

@Injectable()
export class UpdadeCreditCardUseCase {
  constructor(
    @Inject('CreditCardRepository')
    private readonly respository: CreditCardRepository,
  ) {}

  async execute(id: string, userId: string, data: UpdateCreditCardDto) {
    const creditCard = await this.respository.update(id, userId, data);

    if (!creditCard) {
      throw new NotFoundException(CREDIT_CARD_ERRORS.NOT_FOUND);
    }

    return creditCard;
  }
}
