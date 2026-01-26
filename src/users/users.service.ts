import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/schemas/users.schema';
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
      .findOneAndUpdate(
        { _id: id, deleted: false },
        { $set: data },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou já removido');
    }

    return user;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const filter = { deleted: false };

    const [data, total] = await Promise.all([
      this.users.find(filter).skip(skip).limit(limit).lean().exec(),
      this.users.countDocuments(filter),
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
    const user = await this.users
      .findOne({ _id: id, deleted: false })
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.users
      .findOneAndUpdate(
        { _id: id, deleted: false },
        {
          deleted: true,
          deletedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou já removido');
    }

    return {
      message: 'Usuário removido com sucesso',
      data: {
        id: user._id,
        deletedAt: user.deletedAt,
      },
    };
  }
}
