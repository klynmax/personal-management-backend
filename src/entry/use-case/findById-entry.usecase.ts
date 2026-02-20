import { ENTRY_ERRORS } from '../constants/entry.errors';
import { EntryRepository } from '../repositories/entry.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindByIdUseCase {
  constructor(
    @Inject('EntryRepository')
    private readonly repository: EntryRepository,
  ) {}

  async execute(id: string, userId: string) {
    const entry = await this.repository.findById(id, userId);

    if (!entry) {
      throw new NotFoundException(ENTRY_ERRORS.NOT_FOUND);
    }

    return entry;
  }
}
