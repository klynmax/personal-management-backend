import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExpenseCardDocument = HydratedDocument<ExpenseCard>;

@Schema({ timestamps: true })
export class ExpenseCard {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true, index: true })
  cardId: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, required: true, min: 1 })
  totalInstallments: number;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: Boolean, default: false, index: true })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: Date, required: true, index: true })
  endDate: Date;
}

export const ExpenseCardSchema = SchemaFactory.createForClass(ExpenseCard);
