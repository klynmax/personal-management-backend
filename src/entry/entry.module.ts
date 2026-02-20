import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryController } from './entry.controller';
import { Entry, EntrySchema } from './infrastructure/entry.schema';
import { FindByIdUseCase } from './use-case/findById-entry.usecase';
import { CreateEntryUseCase } from './use-case/create-entry.usecase';
import { UpdateEntryUseCase } from './use-case/update-entry.usecase';
import { DeleteEntryUseCase } from './use-case/delete-entry.usecase';
import { FindAllEntryUseCase } from './use-case/findAll-entry.usecase';
import { GetMonthlyEntryUseCase } from './use-case/get-monthly-summary';
import { MongooseEntryRepository } from './infrastructure/mongoose-entry.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
  ],
  controllers: [EntryController],
  providers: [
    FindByIdUseCase,
    CreateEntryUseCase,
    UpdateEntryUseCase,
    DeleteEntryUseCase,
    FindAllEntryUseCase,
    GetMonthlyEntryUseCase,
    {
      provide: 'EntryRepository',
      useClass: MongooseEntryRepository,
    },
  ],
})
export class EntryModule {}
