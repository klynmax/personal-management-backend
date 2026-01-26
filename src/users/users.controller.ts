import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UsersServices } from './users.service';
import { Users } from 'src/schemas/users/users.schema';
import { CreateUsersDTO } from './dtos/create-users.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

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
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todos os usuários cadastrado na API' })
  @ApiCreatedResponse({ description: 'Busca realizada com sucesso.' })
  @ApiBadRequestResponse({
    description:
      'Busca não realizada. Verifique a conexão ou os parametros passados.',
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.usersServices.findAll(Number(page) || 1, Number(limit) || 10);
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
