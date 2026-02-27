import { Inject, Injectable } from '@nestjs/common';
import { CreditCardRepository } from '../repositories/credit-card.repository';

@Injectable()
export class FindAllCreditCardUseCase {
  constructor(
    @Inject('CreditCardRepository')
    private readonly repository: CreditCardRepository,
  ) {}

  async execute(userId: string, page = 1, limit = 10) {
    const { data, total } = await this.repository.findAll(userId, page, limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
}
