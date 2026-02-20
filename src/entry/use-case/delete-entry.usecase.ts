import { ENTRY_ERRORS } from '../constants/entry.errors';
import { EntryRepository } from '../repositories/entry.repository';
import { ENTRY_SUCCESSFULLY_CANCELED } from 'src/shared/constants';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteEntryUseCase {
  constructor(
    @Inject('EntryRepository')
    private readonly repository: EntryRepository,
  ) {}

  async execute(id: string, userId: string) {
    const entry = await this.repository.softDelete(id, userId);

    if (!entry) {
      throw new NotFoundException(ENTRY_ERRORS.NOT_FOUND);
    }

    return {
      message: ENTRY_SUCCESSFULLY_CANCELED,
      data: {
        id: entry.id,
        deletedAt: entry.deletedAt,
      },
    };
  }
}
