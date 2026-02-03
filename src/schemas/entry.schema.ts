import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument } from 'mongoose';
import { AccountType } from 'src/enum/entry.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EntryDocument = HydratedDocument<Entry>;

@Schema({ timestamps: true })
export class Entry {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true })
  bank: string;

  @Prop({ type: String, required: true, enum: AccountType })
  accountType: AccountType;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, required: true })
  source: string;

  @Prop({ type: Boolean, default: false, index: true })
  deleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);
