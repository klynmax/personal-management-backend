import { Inject, Injectable } from '@nestjs/common';
import { EntryRepository } from '../repositories/entry.repository';

@Injectable()
export class GetMonthlyEntryUseCase {
  constructor(
    @Inject('EntryRepository')
    private readonly repository: EntryRepository,
  ) {}

  async execute(userId: string) {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const summary = await this.repository.getMonthlySummary(
      userId,
      startOfMonth,
      endOfMonth,
    );

    return (
      summary ?? {
        balance: 0,
        totalEntries: 0,
        lastEntry: null,
      }
    );
  }
}
