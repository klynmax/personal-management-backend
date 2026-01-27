import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpensesModules } from './expenses/expenses.module';
import { AuthModule } from './auth/auth.module';

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
    UsersModule,
    ExpensesModules,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
