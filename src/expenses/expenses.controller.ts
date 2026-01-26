import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Controller,
} from '@nestjs/common';

import { ExpensesServices } from './expenses.service';
import { CreateExpensesDTO } from './dtos/create-expense.dto';
import { UpdateExpensesDTO } from './dtos/update-expenses.dto';
import { Expenses } from 'src/schemas/expenses.schema';

@Controller('expenses')
@ApiTags('Expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesServices) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cria uma nova despesa.',
  })
  @ApiCreatedResponse({
    description: 'Despesa criada com sucesso',
  })
  @ApiBadRequestResponse({
    description:
      'Despesa não pode ser criada. Verifique os campos e tente novamente',
  })
  create(@Body() body: CreateExpensesDTO) {
    return this.expensesService.create(body);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da despesa',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({
    summary: 'Atualiza os dados da despesa.',
    description: 'Teste',
  })
  @ApiCreatedResponse({
    description: 'Despesa atualizada com sucesso',
  })
  @ApiBadRequestResponse({
    description:
      'Não foi possível atualizar a despesa. Verifique o id ou os parâmentros e tente novamente.',
  })
  update(@Param('id') id: string, @Body() body: UpdateExpensesDTO) {
    return this.expensesService.update(id, body);
  }

  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todas as despesas cadastrado na API' })
  @ApiCreatedResponse({ description: 'Busca realizada com sucesso.' })
  @ApiBadRequestResponse({
    description:
      'Busca não realizada. Verifique a conexão ou os parametros passados.',
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.expensesService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da despesa',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Busca uma despesa a partir do seu id' })
  @ApiCreatedResponse({ description: 'Despesa encontrada com sucesso.' })
  @ApiBadRequestResponse({
    description: 'Despesa não encontrada. Verifique o id e tente novamente.',
  })
  async findById(@Param('id') id: string): Promise<Expenses> {
    return this.expensesService.findById(id);
  }
}
