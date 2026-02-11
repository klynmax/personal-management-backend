import { Module } from '@nestjs/common';
import { EntryServices } from './entry.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryController } from './entry.controller';
import { Entry, EntrySchema } from 'src/schemas/entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
  ],
  controllers: [EntryController],
  providers: [EntryServices],
})
export class EntryModule {}
