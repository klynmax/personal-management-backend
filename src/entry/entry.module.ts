import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entry, EntrySchema } from 'src/schemas/entry.schema';
import { EntryController } from './entry.controller';
import { EntryServices } from './entry.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
  ],
  controllers: [EntryController],
  providers: [EntryServices],
})
export class EntryModule {}
