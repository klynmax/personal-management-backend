import { Module } from '@nestjs/common';
import { ExpenseCardController } from './expenseCard.controller';
import { ExpenseCardService } from './expenseCard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseCard, ExpenseCardSchema } from 'src/schemas/expenseCard.schema';
import { CreditCard, CreditCardSchema } from 'src/schemas/creditCard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseCard.name, schema: ExpenseCardSchema },
      { name: CreditCard.name, schema: CreditCardSchema },
    ]),
  ],
  controllers: [ExpenseCardController],
  providers: [ExpenseCardService],
})
export class ExpenseCardModule {}
