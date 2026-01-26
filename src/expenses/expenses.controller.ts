import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ExpensesServices } from './expenses.service';
import { CreateExpensesDTO } from './dtos/create-expense.dto';
import { UpdateExpensesDTO } from './dtos/update-expenses.dto';

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
}
