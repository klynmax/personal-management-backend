import { ENTRY_ERRORS } from '../constants/entry.errors';
import { UpdateEntryDTO } from '../dtos/update-entry.dto';
import { EntryRepository } from '../repositories/entry.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UpdateEntryUseCase {
  constructor(
    @Inject('EntryRepository')
    private readonly repository: EntryRepository,
  ) {}

  async execute(id: string, userId: string, data: UpdateEntryDTO) {
    const entry = await this.repository.update(id, userId, data);

    if (!entry) {
      throw new NotFoundException(ENTRY_ERRORS.NOT_FOUND);
    }

    return entry;
  }
}
