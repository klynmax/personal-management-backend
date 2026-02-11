import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseCardService } from './expenseCard.service';
import { ExpenseCardController } from './expenseCard.controller';
import { CreditCard, CreditCardSchema } from 'src/schemas/creditCard.schema';
import { ExpenseCard, ExpenseCardSchema } from 'src/schemas/expenseCard.schema';

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
