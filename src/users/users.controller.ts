import {
  ApiTags,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UsersServices } from './users.service';
import { CreateUsersDTO } from './dtos/create-users.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersServices: UsersServices) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cria um novo usuário.',
    description: 'Teste',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
  })
  @ApiBadRequestResponse({
    description:
      'Usuário não pode ser criado. Verifique os campos e tente novamente',
  })
  create(@Body() body: CreateUsersDTO) {
    return this.usersServices.create(body);
  }

  @Get('/all')
  findAll() {
    return this.usersServices.findAll();
  }
}
