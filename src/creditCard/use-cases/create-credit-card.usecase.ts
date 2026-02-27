import { Inject, Injectable } from '@nestjs/common';
import { CreditCardRepository } from '../repositories/credit-card.repository';
import { CreateCreditCardInput } from '../entities/create-credit-card.entity';
import { CreditCardEntity } from '../entities/credit-card.entity';

@Injectable()
export class CreateCreditCardUseCase {
  constructor(
    @Inject('CreditCardRepository')
    private readonly repository: CreditCardRepository,
  ) {}

  async execute(data: CreateCreditCardInput): Promise<CreditCardEntity> {
    return this.repository.create(data);
  }
}
