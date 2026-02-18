import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreditCard } from 'src/schemas/creditCard.schema';
import { ExpenseCard } from 'src/schemas/expenseCard.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseCardDto } from './dtos/create-expense-card.dto';
import calculateFirstDueDate from 'src/shared/utils/calculateFirstDueDate';
import { UpdateExpenseCardDto } from './dtos/update-expense-card.dto';

type OpenAggregateResult = {
  total: number;
  count: number;
};

type TotalMonthAggregate = {
  total: number;
};
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
        deleted: false,
        dueDate: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
      .sort({ dueDate: 1 });
  }

  async findById(id: string, userId: string): Promise<ExpenseCard> {
    const expenseCard = await this.expenseCard
      .findOne({ _id: id, userId, deleted: false })
      .lean()
      .exec();

    if (!expenseCard) {
      throw new NotFoundException('Despesa não encontrada ou acesso negado.');
    }

    return expenseCard;
  }

  async delete(parentExpenseId: string, userId: string) {
    const expenses = await this.expenseCard.find({
      parentExpenseId,
      userId,
      deleted: false,
    });

    if (!expenses.length) {
      throw new NotFoundException('Despesa não encontrada');
    }

    await this.expenseCard.updateMany(
      {
        parentExpenseId,
        userId,
        deleted: false,
      },
      {
        $set: { deleted: true },
      },
    );

    return {
      message: 'Despesa removida com sucesso',
    };
  }

  async getExpenseCardSummary(userId: string) {
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

    // Total do mês
    const totalMonthAgg = await this.expenseCard.aggregate<TotalMonthAggregate>(
      [
        {
          $match: {
            userId,
            deleted: false,
            dueDate: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ],
    );

    const totalMonth = totalMonthAgg[0]?.total || 0;

    // Total em aberto + Parcelas ativas
    const openAgg = await this.expenseCard.aggregate<OpenAggregateResult>([
      {
        $match: {
          userId,
          deleted: false,
          paid: false,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalOpen = openAgg[0]?.total || 0;
    const activeInstallments = openAgg[0]?.count || 0;

    // Próximo vencimento
    const nextDue = await this.expenseCard
      .findOne({
        userId,
        deleted: false,
        paid: false,
        dueDate: { $gte: now },
      })
      .sort({ dueDate: 1 })
      .select('dueDate');

    return {
      totalMonth,
      totalOpen,
      nextDueDate: nextDue ? nextDue.dueDate.toISOString() : null,
      activeInstallments,
    };
  }
}
