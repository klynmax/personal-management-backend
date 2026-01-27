import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServices } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersServices],
  exports: [UsersServices],
})
export class UsersModule {}
