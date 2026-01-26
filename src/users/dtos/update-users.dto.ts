import { PartialType } from '@nestjs/swagger';
import { CreateUsersDTO } from './create-users.dto';

export class UpdateUsersDTO extends PartialType(CreateUsersDTO) {}
