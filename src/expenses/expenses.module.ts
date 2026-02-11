import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesServices } from './expenses.service';
import { ExpensesController } from './expenses.controller';
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
