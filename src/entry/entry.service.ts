import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry } from 'src/schemas/entry.schema';
import { CreateEntryDTO } from './dtos/create-entry.dto';

@Injectable()
export class EntryServices {
  constructor(
    @InjectModel(Entry.name)
    private readonly entryModel: Model<Entry>,
  ) {}

  create(data: CreateEntryDTO & { userId: string }) {
    const newEntry = new this.entryModel({
      ...data,
      userId: data.userId,
    });

    return newEntry.save();
  }
}
