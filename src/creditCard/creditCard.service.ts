import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditCard } from 'src/schemas/creditCard.schema';
import { CreateCreditCardDto } from './dtos/create-credit-card.dto';

@Injectable()
export class CreditCardServices {
  constructor(
    @InjectModel(CreditCard.name)
    private readonly creditCard: Model<CreditCard>,
  ) {}

  create(data: CreateCreditCardDto & { userId: string }) {
    const newCard = new this.creditCard({
      ...data,
      userId: data.userId,
    });
    return newCard.save();
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = { deleted: false, userId };
    const [data, total] = await Promise.all([
      this.creditCard.find(filter).skip(skip).limit(limit).lean().exec(),
      this.creditCard.countDocuments(filter),
    ]);

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

  async findById(id: string, userId: string): Promise<CreditCard> {
    const entry = await this.creditCard
      .findOne({ _id: id, userId, deleted: false })
      .lean()
      .exec();

    if (!entry) {
      throw new NotFoundException(
        'Cartão não encontrado ou o acesso foi negado',
      );
    }

    return entry;
  }
}
