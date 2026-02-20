import { Inject, Injectable } from '@nestjs/common';
import { EntryInterface } from '../entities/entry.entity';
import { EntryRepository } from '../repositories/entry.repository';
import { CreateEntryInput } from '../entities/create-entry.entity';

@Injectable()
export class CreateEntryUseCase {
  constructor(
    @Inject('EntryRepository')
    private readonly repository: EntryRepository,
  ) {}

  async execute(data: CreateEntryInput): Promise<EntryInterface> {
    return this.repository.create(data);
  }
}
