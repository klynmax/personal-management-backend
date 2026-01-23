import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/users/users.schema';
import { CreateUsersDTO } from './dtos/create-users.dto';

@Injectable()
export class UsersServices {
  constructor(
    @InjectModel(Users.name)
    private users: Model<Users>,
  ) {}

  create(body: CreateUsersDTO): Promise<Users> {
    const newUser = new this.users(body);
    return newUser.save();
  }

  findAll() {
    return this.users.find();
  }
}
