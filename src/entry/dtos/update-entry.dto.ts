import { PartialType } from '@nestjs/swagger';
import { CreateEntryDTO } from './create-entry.dto';

export class UpdateEntryDTO extends PartialType(CreateEntryDTO) {}
