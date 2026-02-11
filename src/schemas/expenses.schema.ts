import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentType, StatusExpense } from 'src/enum/expenses.enum';

export type ExpensesDocument = HydratedDocument<Expenses>;

@Schema({ timestamps: true })
export class Expenses {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, ref: 'Users', required: true, index: true })
  userId: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: PaymentType })
  paymentType: PaymentType;

  @Prop({ enum: StatusExpense, default: 'active' })
  status: StatusExpense;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const ExpensesSchema = SchemaFactory.createForClass(Expenses);
