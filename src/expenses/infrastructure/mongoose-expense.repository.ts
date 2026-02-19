import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ExpenseMapper } from './expense.mapper';
import { Expense } from '../entities/expense.entity';
import { MonthlySummary } from '../entities/monthly-summary';
import { PaginatedResult } from 'src/interfaces/IPaginatedResult';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CreateExpenseInput } from '../entities/create-expense.entity';
import { UpdateExpenseInput } from '../entities/update-expense.entity';
import { Expenses, ExpensesDocument } from 'src/schemas/expenses.schema';

@Injectable()
export class MongooseExpenseRepository implements ExpenseRepository {
  constructor(
    @InjectModel(Expenses.name)
    private readonly model: Model<Expenses>,
  ) {}

  async create(data: CreateExpenseInput): Promise<Expense> {
    const created: ExpensesDocument = await this.model.create(data);

    return ExpenseMapper.toDomain(created);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateExpenseInput,
  ): Promise<Expense | null> {
    const updated: ExpensesDocument | null = await this.model.findOneAndUpdate(
      { _id: id, userId, deleted: false },
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!updated) return null;

    return ExpenseMapper.toDomain(updated);
  }

  async findById(id: string, userId: string): Promise<Expense | null> {
    const document: ExpensesDocument | null = await this.model.findOne({
      _id: id,
      userId,
      deleted: false,
    });

    if (!document) return null;

    return ExpenseMapper.toDomain(document);
  }

  async findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Expense>> {
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.model.find({ userId, deleted: false }).skip(skip).limit(limit),
      this.model.countDocuments({ userId, deleted: false }),
    ]);

    return {
      data: documents.map((doc) => ExpenseMapper.toDomain(doc)),
      total,
    };
  }

  async softDelete(id: string, userId: string): Promise<Expense | null> {
    const updated: ExpensesDocument | null = await this.model.findOneAndUpdate(
      { _id: id, userId, deleted: false },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updated) return null;

    return ExpenseMapper.toDomain(updated);
  }

  async getMonthlySummary(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlySummary> {
    const result = await this.model.aggregate<MonthlySummary>([
      {
        $match: {
          userId,
          deleted: false,
          createdAt: { $gte: startDate, $lte: endDate },
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
    ]);

    if (!result.length) {
      return {
        totalAmount: 0,
        totalExpenses: 0,
        lastPurchaseDate: null,
        totalDebit: 0,
        totalVoucher: 0,
      };
    }

    const summary = result[0];

    return {
      totalAmount: summary.totalAmount,
      totalExpenses: summary.totalExpenses,
      lastPurchaseDate: summary.lastPurchaseDate ?? null,
      totalDebit: summary.totalDebit,
      totalVoucher: summary.totalVoucher,
    };
  }
}
