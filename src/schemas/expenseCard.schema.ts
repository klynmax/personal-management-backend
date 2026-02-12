import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExpenseCardDocument = HydratedDocument<ExpenseCard>;

@Schema({ timestamps: true })
export class ExpenseCard {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ required: true, index: true })
  userId: string; // 👈 ADICIONE ISSO

  @Prop({ required: true, index: true })
  cardId: string;

  @Prop({ required: true })
  cardName: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  installmentNumber: number;

  @Prop({ required: true })
  totalInstallments: number;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop({ required: true, index: true })
  dueDate: Date;

  @Prop({ type: String }) // 👈 NÃO use ObjectId aqui
  parentExpenseId?: string;

  @Prop({ default: false })
  paid: boolean;

  @Prop({ default: false }) // 👈 ADICIONE ISSO
  deleted: boolean;
}

export const ExpenseCardSchema = SchemaFactory.createForClass(ExpenseCard);
