import { PaginatedResult } from 'src/interfaces/IPaginatedResult';
import { UpdateCreditCardDto } from '../dtos/update-credit-card.dto';
import { CreateCreditCardInput } from '../entities/create-credit-card.entity';
import { CreditCardEntity } from '../entities/credit-card.entity';
import { UpdateCreditCardInput } from '../entities/update-credit-card';

export interface CreditCardRepository {
  create(data: CreateCreditCardInput): Promise<CreditCardEntity>;
  findById(id: string, userId: string): Promise<CreditCardEntity | null>;
  update(
    id: string,
    userId: string,
    data: UpdateCreditCardInput | null,
  ): Promise<UpdateCreditCardDto | null>;
  findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<CreditCardEntity>>;
  softDelete(id: string, userId: string): Promise<CreditCardEntity | null>;
}
