import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { EntryMapper } from './entry.mapper';
import { InjectModel } from '@nestjs/mongoose';
import { Entry, EntryDocument } from './entry.schema';
import { EntryInterface } from '../entities/entry.entity';
import { CreateEntryInput } from '../entities/create-entry.entity';
import { PaginatedResult } from 'src/interfaces/IPaginatedResult';
import { UpdateEntryInput } from '../entities/update-entry.entity';
import { EntryRepository } from '../repositories/entry.repository';
import { IMonthlyEntrySummary } from 'src/interfaces/IMonthlyEntrySummary';

@Injectable()
export class MongooseEntryRepository implements EntryRepository {
  constructor(
    @InjectModel(Entry.name)
    private readonly model: Model<Entry>,
  ) {}

  async create(data: CreateEntryInput): Promise<EntryInterface> {
    const created: EntryDocument = await this.model.create(data);

    return EntryMapper.toDomain(created);
  }

  async findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<EntryInterface>> {
    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      this.model.find({ userId, deleted: false }).skip(skip).limit(limit),
      this.model.countDocuments({ userId, deleted: false }),
    ]);

    return {
      data: documents.map((doc) => EntryMapper.toDomain(doc)),
      total,
    };
  }

  async update(
    id: string,
    userId: string,
    data: UpdateEntryInput,
  ): Promise<EntryInterface | null> {
    const updated: EntryDocument | null = await this.model.findOneAndUpdate(
      { _id: id, userId, deleted: false },
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!updated) return null;

    return EntryMapper.toDomain(updated);
  }

  async findById(id: string, userId: string): Promise<EntryInterface | null> {
    const document: EntryDocument | null = await this.model.findOne({
      _id: id,
      userId,
      deleted: false,
    });

    if (!document) return null;

    return EntryMapper.toDomain(document);
  }

  async softDelete(id: string, userId: string): Promise<EntryInterface | null> {
    const updated: EntryDocument | null = await this.model.findOneAndUpdate(
      { _id: id, userId, deleted: false },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updated) return null;

    return EntryMapper.toDomain(updated);
  }

  async getMonthlySummary(
    userId: string,
    startOfMonth: Date,
    endOfMonth: Date,
  ): Promise<IMonthlyEntrySummary> {
    const result = await this.model.aggregate<IMonthlyEntrySummary>([
      {
        $match: {
          userId,
          deleted: false,
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          balance: { $sum: '$amount' },
          totalEntries: { $sum: 1 },
          lastEntry: { $max: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 0,
          balance: 1,
          totalEntries: 1,
          lastEntry: 1,
        },
      },
    ]);

    return (
      result[0] ?? {
        balance: 0,
        totalEntries: 0,
        lastEntry: null,
      }
    );
  }
}
