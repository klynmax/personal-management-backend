import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LevelUsersType, StatusUsersType } from 'src/enum/users.enum';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ required: true, trim: true, minlength: 2 })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({
    enum: StatusUsersType,
    default: 'active',
  })
  status: 'active' | 'inactive';

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ enum: LevelUsersType, required: true })
  level: LevelUsersType;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);

UserSchema.pre('save', async function () {
  const user = this as HydratedDocument<Users>;

  if (!user.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});
