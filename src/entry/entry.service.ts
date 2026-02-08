import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry } from 'src/schemas/entry.schema';
import { CreateEntryDTO } from './dtos/create-entry.dto';
import { UpdateEntryDTO } from './dtos/update-entry.dto';

@Injectable()
export class EntryServices {
  constructor(
    @InjectModel(Entry.name)
    private readonly entry: Model<Entry>,
  ) {}

  create(data: CreateEntryDTO & { userId: string }) {
    const newEntry = new this.entry({
      ...data,
      userId: data.userId,
    });

    return newEntry.save();
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const filter = { deleted: false, userId };
    const [data, total] = await Promise.all([
      this.entry.find(filter).skip(skip).limit(limit).lean().exec(),
      this.entry.countDocuments(filter),
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

  async findById(id: string, userId: string): Promise<Entry> {
    const entry = await this.entry
      .findOne({ _id: id, userId, deleted: false })
      .lean()
      .exec();

    if (!entry) {
      throw new NotFoundException(
        'Entrada não encontrada ou o acesso foi negado',
      );
    }

    return entry;
  }

  async update(id: string, userId: string, data: UpdateEntryDTO) {
    const entry = await this.entry
      .findOneAndUpdate(
        { _id: id, userId, deleted: false },
        { $set: data },
        { new: true, runValidators: true },
      )
      .exec();

    if (!entry) {
      throw new NotFoundException('Despesa não encontrada ou acesso negado.');
    }

    return entry;
  }
}
