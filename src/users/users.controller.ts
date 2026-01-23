import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersServices } from './users.service';
import { CreateUsersDTO } from './dtos/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersServices) {}
  @Get('/all')
  findAll() {
    return this.usersServices.findAll();
  }

  @Post()
  create(@Body() body: CreateUsersDTO) {
    return this.usersServices.create(body);
  }
}
