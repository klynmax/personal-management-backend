import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreditCard } from 'src/schemas/creditCard.schema';
import { ExpenseCard } from 'src/schemas/expenseCard.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseCardDto } from './dtos/create-expense-card.dto';
import calculateFirstDueDate from 'src/shared/utils/calculateFirstDueDate';
import { UpdateExpenseCardDto } from './dtos/update-expense-card.dto';

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

    const installmentValue = Number(
      (dto.amount / dto.totalInstallments).toFixed(2),
    );

    const purchaseDate = new Date(dto.purchaseDate);

    const firstDueDate = calculateFirstDueDate(
      purchaseDate,
      card.closingDay,
      card.dueDay,
    );

    const parentId = new mongoose.Types.ObjectId();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const installments: any[] = [];

    for (let i = 0; i < dto.totalInstallments; i++) {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        userId,
        cardId: dto.cardId,
        cardName: dto.cardName,
        brand: dto.brand,
        category: dto.category,
        description: dto.description,
        amount: installmentValue,
        totalAmount: dto.amount,
        installmentNumber: i + 1,
        totalInstallments: dto.totalInstallments,
        purchaseDate: purchaseDate,
        dueDate,
        parentExpenseId: parentId,
      });
    }

    return await this.expenseCard.insertMany(installments);
  }

  async update(
    parentExpenseId: string,
    dto: UpdateExpenseCardDto,
    userId: string,
  ) {
    const card = await this.creditCard.findOne({
      _id: dto.cardId,
      userId,
      deleted: false,
    });

    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }

    // Verifica se a despesa existe
    const existingExpense = await this.expenseCard.findOne({
      parentExpenseId: parentExpenseId,
      userId,
    });

    if (!existingExpense) {
      throw new NotFoundException('Despesa não encontrada');
    }

    // 🔥 Remove parcelas antigas
    await this.expenseCard.deleteMany({
      parentExpenseId: parentExpenseId,
      userId,
    });

    const installmentValue = Number(
      (dto.amount / dto.totalInstallments).toFixed(2),
    );

    const purchaseDate = new Date(dto.purchaseDate);

    const firstDueDate = calculateFirstDueDate(
      purchaseDate,
      card.closingDay,
      card.dueDay,
    );

    const parentId = new mongoose.Types.ObjectId(parentExpenseId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const installments: any[] = [];

    for (let i = 0; i < dto.totalInstallments; i++) {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        userId,
        cardId: dto.cardId,
        cardName: dto.cardName,
        brand: dto.brand,
        category: dto.category,
        description: dto.description,
        amount: installmentValue,
        totalAmount: dto.amount,
        installmentNumber: i + 1,
        totalInstallments: dto.totalInstallments,
        purchaseDate,
        dueDate,
        parentExpenseId: parentId,
      });
    }

    return await this.expenseCard.insertMany(installments);
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = { deleted: false, userId };

    const [data, total] = await Promise.all([
      this.expenseCard.find(filter).skip(skip).limit(limit).lean().exec(),
      this.expenseCard.countDocuments(filter),
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

  async findCurrentMonth(userId: string) {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return this.expenseCard
      .find({
        userId,
        dueDate: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
      .sort({ dueDate: 1 });
  }
}
