import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { EntryModule } from './entry/entry.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpensesModules } from './expenses/expenses.module';
import { CreditCardModule } from './creditCard/creditCard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URL');

        if (!uri) {
          throw new Error('MONGODB_URL is not defined');
        }

        return { uri };
      },
    }),
    AuthModule,
    EntryModule,
    UsersModule,
    ExpensesModules,
    CreditCardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
