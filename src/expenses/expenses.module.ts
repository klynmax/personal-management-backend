import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesController } from './expenses.controller';
import { Expenses, ExpensesSchema } from 'src/schemas/expenses.schema';
import { CreateExpenseUseCase } from './use-cases/create-expense.usecase';
import { DeleteExpenseUseCase } from './use-cases/delete-expense.usecase';
import { UpdateExpenseUseCase } from './use-cases/update-expense.usecase';
import { GetMonthlySummaryUseCase } from './use-cases/get-monthly-summary';
import { FindAllExpensesUseCase } from './use-cases/find-all-expenses.usecase';
import { FindExpenseByIdUseCase } from './use-cases/find-expense-by-id.usecase';
import { MongooseExpenseRepository } from './infrastructure/mongoose-expense.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expenses.name, schema: ExpensesSchema },
    ]),
  ],
  controllers: [ExpensesController],
  providers: [
    CreateExpenseUseCase,
    DeleteExpenseUseCase,
    UpdateExpenseUseCase,
    FindExpenseByIdUseCase,
    FindAllExpensesUseCase,
    GetMonthlySummaryUseCase,
    {
      provide: 'ExpenseRepository',
      useClass: MongooseExpenseRepository,
    },
  ],
})
export class ExpensesModule {}
