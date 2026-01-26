import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/schemas/users/users.schema';
import { CreateUsersDTO } from './dtos/create-users.dto';
import { UpdateUsersDTO } from './dtos/update-users.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

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

  async update(id: string, data: UpdateUsersDTO): Promise<Users> {
    const user = await this.users
      .findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return user;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.users.find().skip(skip).limit(limit).lean().exec(),
      this.users.countDocuments(),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Users> {
    const user = await this.users.findById(id).lean().exec();
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return user;
  }
}
