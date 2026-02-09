import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BrandCard } from 'src/enum/creditCard.enum';

export class CreateCreditCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsEnum(BrandCard)
  brand: BrandCard;

  @IsNumber()
  @Min(0)
  limit: number;

  @IsNumber()
  @Min(1)
  @Max(30)
  bestPurchaseDay: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  closingDay: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;
}
