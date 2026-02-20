import { Inject, Injectable } from '@nestjs/common';
import { EntryRepository } from '../repositories/entry.repository';

@Injectable()
export class FindAllEntryUseCase {
  constructor(
    @Inject('EntryRepository')
    private readonly repository: EntryRepository,
  ) {}

  async execute(userId: string, page = 1, limit = 10) {
    const { data, total } = await this.repository.findAll(userId, page, limit);

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
}
