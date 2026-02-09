import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BrandCard } from 'src/enum/creditCard.enum';
import { HydratedDocument } from 'mongoose';

export type CreditCardDocument = HydratedDocument<CreditCard>;

@Schema({ timestamps: true })
export class CreditCard {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  surname: string;

  @Prop({
    type: String,
    required: true,
    enum: BrandCard,
  })
  brand: string;

  @Prop({ type: Number, required: true, min: 0 })
  limit: number;

  @Prop({ type: Number, required: true, min: 1, max: 30 })
  bestPurchaseDay: number;

  @Prop({ type: Boolean, default: false, index: true })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: Number, required: true, min: 1, max: 31 })
  closingDay: number;

  @Prop({ type: Number, required: true, min: 1, max: 31 })
  dueDay: number;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);
