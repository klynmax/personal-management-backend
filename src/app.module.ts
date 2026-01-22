import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [],
  controllers: [UsersModule],
  providers: [],
})
export class AppModule {}
