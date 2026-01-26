import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesServices } from './expenses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expenses, ExpensesSchema } from 'src/schemas/expenses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expenses.name, schema: ExpensesSchema },
    ]),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesServices],
})
export class ExpensesModules {}
