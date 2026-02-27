import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCreditCardInput } from '../entities/create-credit-card.entity';
import { CreditCardEntity } from '../entities/credit-card.entity';
import { CreditCardRepository } from '../repositories/credit-card.repository';
import { CreditCard, CreditCardDocument } from './credit-card.schema';
import { CreditCardMapper } from './credit-card.mapper';
import { UpdateCreditCardInput } from '../entities/update-credit-card';
import { PaginatedResult } from 'src/interfaces/IPaginatedResult';

@Injectable()
export class MongooseCreditCardRepository implements CreditCardRepository {
  constructor(
    @InjectModel(CreditCard.name)
    private readonly model: Model<CreditCard>,
  ) {}

  async create(data: CreateCreditCardInput): Promise<CreditCardEntity> {
    const created: CreditCardDocument = await this.model.create(data);

    return CreditCardMapper.toDomain(created);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCreditCardInput,
  ): Promise<CreditCardEntity | null> {
    const updated: CreditCardDocument | null =
      await this.model.findOneAndUpdate(
        { _id: id, userId, deleted: false },
        { $set: data },
        { new: true, runValidators: true },
      );

    if (!updated) return null;

    return CreditCardMapper.toDomain(updated);
  }

  async findById(id: string, userId: string): Promise<CreditCardEntity | null> {
    const document: CreditCardDocument | null = await this.model.findOne({
      _id: id,
      userId,
      deleted: false,
    });

    if (!document) return null;

    return CreditCardMapper.toDomain(document);
  }

  async findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<CreditCardEntity>> {
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.model.find({ userId, deleted: false }).skip(skip).limit(limit),
      this.model.countDocuments({ userId, deleted: false }),
    ]);

    return {
      data: documents.map((doc) => CreditCardMapper.toDomain(doc)),
      total,
    };
  }

  async softDelete(
    id: string,
    userId: string,
  ): Promise<CreditCardEntity | null> {
    const updated: CreditCardDocument | null =
      await this.model.findOneAndUpdate(
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

    return CreditCardMapper.toDomain(updated);
  }
}
