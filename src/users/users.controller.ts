import {
  ApiTags,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UsersServices } from './users.service';
import { CreateUsersDTO } from './dtos/create-users.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Users } from 'src/schemas/users/users.schema';

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

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Busca o usuário a partir do seu id' })
  @ApiCreatedResponse({ description: 'Usuário encontrado com sucesso.' })
  @ApiBadRequestResponse({
    description: 'Usuário não encontrado. Verifique o id e tente novamente.',
  })
  async findById(@Param('id') id: string): Promise<Users> {
    return this.usersServices.findById(id);
  }
}
