import { Module } from '@nestjs/common';
import { ExpenseCardController } from './expenseCard.controller';
import { ExpenseCardService } from './expenseCard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseCard, ExpenseCardSchema } from 'src/schemas/expenseCard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseCard.name, schema: ExpenseCardSchema },
    ]),
  ],
  controllers: [ExpenseCardController],
  providers: [ExpenseCardService],
})
export class ExpenseCardModule {}
