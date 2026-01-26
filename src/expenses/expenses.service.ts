import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Expenses } from 'src/schemas/expenses.schema';
import { CreateExpensesDTO } from './dtos/create-expense.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateExpensesDTO } from './dtos/update-expenses.dto';
import { StatusExpense } from 'src/enum/expenses.enum';

@Injectable()
export class ExpensesServices {
  constructor(
    @InjectModel(Expenses.name)
    private expenses: Model<Expenses>,
  ) {}

  // TODO: melhorar a criação quando tiver auth/JWT para pegar o id do usuário pela sessão.
  create(body: CreateExpensesDTO) {
    const newExpense = new this.expenses(body);
    return newExpense.save();
  }

  async update(id: string, data: UpdateExpensesDTO): Promise<Expenses> {
    const expense = await this.expenses
      .findByIdAndUpdate(
        { _id: id, deleted: false },
        { $set: data },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!expense) {
      throw new NotFoundException('Despesa não encontrada ou já removida.');
    }

    return expense;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const filter = { deleted: false };

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

  async findById(id: string): Promise<Expenses> {
    const expense = await this.expenses
      .findOne({ _id: id, deleted: false })
      .lean()
      .exec();

    if (!expense) {
      throw new NotFoundException(`Despesa com id ${id} não encontrado`);
    }

    return expense;
  }

  async remove(id: string) {
    const expense = await this.expenses
      .findOneAndUpdate(
        { _id: id, deleted: false },
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
      throw new NotFoundException('Despesa não encontrada ou já removida');
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
}
