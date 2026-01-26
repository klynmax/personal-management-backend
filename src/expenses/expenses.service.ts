import { InjectModel } from '@nestjs/mongoose';
import { CreateExpensesDTO } from './dtos/create-expense.dto';
import { Expenses } from 'src/schemas/expenses.schema';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateExpensesDTO } from './dtos/update-expenses.dto';

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
}
