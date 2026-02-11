import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Expenses } from 'src/schemas/expenses.schema';
import { StatusExpense } from 'src/enum/expenses.enum';
import MonthlySummary from 'src/interfaces/IMonthlySumary';
import { CreateExpensesDTO } from './dtos/create-expense.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateExpensesDTO } from './dtos/update-expenses.dto';

@Injectable()
export class ExpensesServices {
  constructor(
    @InjectModel(Expenses.name)
    private expenses: Model<Expenses>,
  ) {}

  create(data: CreateExpensesDTO & { userId: string }) {
    const newExpense = new this.expenses({
      ...data,
      userId: data.userId,
    });

    return newExpense.save();
  }

  async update(
    id: string,
    userId: string,
    data: UpdateExpensesDTO,
  ): Promise<Expenses> {
    const expense = await this.expenses
      .findOneAndUpdate(
        { _id: id, userId, deleted: false },
        { $set: data },
        { new: true, runValidators: true },
      )
      .exec();

    if (!expense) {
      throw new NotFoundException('Despesa não encontrada ou acesso negado.');
    }

    return expense;
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const filter = { deleted: false, userId };

    const [data, total] = await Promise.all([
      this.expenses.find(filter).skip(skip).limit(limit).lean().exec(),
      this.expenses.countDocuments(filter),
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

  async findById(id: string, userId: string): Promise<Expenses> {
    const expense = await this.expenses
      .findOne({ _id: id, userId, deleted: false })
      .lean()
      .exec();

    if (!expense) {
      throw new NotFoundException('Despesa não encontrada ou acesso negado.');
    }

    return expense;
  }

  async remove(id: string, userId: string) {
    const expense = await this.expenses
      .findOneAndUpdate(
        { _id: id, userId, deleted: false },
        {
          $set: {
            deleted: true,
            deletedAt: new Date(),
            status: StatusExpense.CANCELED,
          },
        },
        { new: true },
      )
      .exec();

    if (!expense) {
      throw new NotFoundException('Despesa não encontrada ou acesso negado.');
    }

    return {
      message: 'Despesa cancelada com sucesso',
      data: {
        id: expense._id,
        status: expense.status,
        deletedAt: expense.deletedAt,
      },
    };
  }

  async getMonthlySummary(userId: string) {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const result = await this.expenses.aggregate<MonthlySummary>([
      {
        $match: {
          userId,
          deleted: false,
          status: StatusExpense.ACTIVE,
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalExpenses: { $sum: 1 },
          lastPurchaseDate: { $max: '$createdAt' },

          totalDebit: {
            $sum: {
              $cond: [{ $eq: ['$paymentType', 'debit'] }, '$amount', 0],
            },
          },
          totalVoucher: {
            $sum: {
              $cond: [{ $eq: ['$paymentType', 'voucher'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          totalExpenses: 1,
          lastPurchaseDate: 1,
          totalDebit: 1,
          totalVoucher: 1,
        },
      },
    ]);

    const summary = result[0];

    return (
      summary ?? {
        totalAmount: 0,
        totalExpenses: 0,
        lastPurchaseDate: null,
        totalDebit: 0,
        totalVoucher: 0,
      }
    );
  }
}
