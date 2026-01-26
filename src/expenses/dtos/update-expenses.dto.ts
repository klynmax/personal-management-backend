import { PartialType } from '@nestjs/swagger';
import { CreateExpensesDTO } from './create-expense.dto';

export class UpdateExpensesDTO extends PartialType(CreateExpensesDTO) {}
