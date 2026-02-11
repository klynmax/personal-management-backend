import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreditCard } from 'src/schemas/creditCard.schema';
import { ExpenseCard } from 'src/schemas/expenseCard.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseCardDto } from './dtos/create-expense-card.dto';

@Injectable()
export class ExpenseCardService {
  constructor(
    @InjectModel(ExpenseCard.name)
    private readonly expenseCard: Model<ExpenseCard>,
    @InjectModel(CreditCard.name)
    private readonly creditCard: Model<CreditCard>,
  ) {}

  async create(dto: CreateExpenseCardDto, userId: string) {
    const card = await this.creditCard.findOne({
      _id: dto.cardId,
      userId,
      deleted: false,
    });

    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }

    const newExpense = new this.expenseCard({
      ...dto,
      userId,
    });

    return await newExpense.save();
  }
}
