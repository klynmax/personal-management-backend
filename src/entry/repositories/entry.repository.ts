import { EntryInterface } from '../entities/entry.entity';
import { UpdateEntryDTO } from '../dtos/update-entry.dto';
import { PaginatedResult } from 'src/interfaces/IPaginatedResult';
import { CreateEntryInput } from '../entities/create-entry.entity';
import { UpdateEntryInput } from '../entities/update-entry.entity';
import { IMonthlyEntrySummary } from 'src/interfaces/IMonthlyEntrySummary';

export interface EntryRepository {
  create(data: CreateEntryInput): Promise<EntryInterface>;
  findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<EntryInterface>>;
  update(
    id: string,
    userId: string,
    data: UpdateEntryInput,
  ): Promise<UpdateEntryDTO | null>;
  findById(id: string, userId: string): Promise<EntryInterface | null>;
  softDelete(id: string, userId: string): Promise<EntryInterface | null>;
  getMonthlySummary(
    userId: string,
    startOfMonth: Date,
    endOfMonth: Date,
  ): Promise<IMonthlyEntrySummary>;
}
