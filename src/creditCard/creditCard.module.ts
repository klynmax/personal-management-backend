import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditCardServices } from './creditCard.service';
import { CreditCardController } from './creditCard.controller';
import { CreditCard, CreditCardSchema } from 'src/schemas/creditCard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CreditCard.name, schema: CreditCardSchema },
    ]),
  ],
  controllers: [CreditCardController],
  providers: [CreditCardServices],
})
export class CreditCardModule {}
