import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditCardServices } from './creditCard.service';
import { CreditCardController } from './creditCard.controller';
import { CreditCard, CreditCardSchema } from 'src/schemas/creditCard.schema';
import { CreateCreditCardUseCase } from './use-cases/create-credit-card.usecase';
import { MongooseCreditCardRepository } from './infrastructure/mongoose-credit-card.repository';
import { UpdadeCreditCardUseCase } from './use-cases/update-credit-card.usecase';
import { FindByIdCreditCardUseCase } from './use-cases/find-by-id-credit-card.usecase';
import { FindAllCreditCardUseCase } from './use-cases/find-all.usecase';
import { DeleteCreditCardUseCase } from './use-cases/delete-credit-card.usecase';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditCard.name, schema: CreditCardSchema },
    ]),
  ],
  controllers: [CreditCardController],
  providers: [
    CreditCardServices,
    CreateCreditCardUseCase,
    UpdadeCreditCardUseCase,
    FindByIdCreditCardUseCase,
    FindAllCreditCardUseCase,
    DeleteCreditCardUseCase,
    {
      provide: 'CreditCardRepository',
      useClass: MongooseCreditCardRepository,
    },
  ],
})
export class CreditCardModule {}
