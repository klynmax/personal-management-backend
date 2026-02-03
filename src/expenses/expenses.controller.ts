import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Controller,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { ExpensesServices } from './expenses.service';
import { CreateExpensesDTO } from './dtos/create-expense.dto';
import { UpdateExpensesDTO } from './dtos/update-expenses.dto';
import { Expenses } from 'src/schemas/expenses.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/interfaces/AuthenticatedRequest';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard) // protege todas as rotas
export class ExpensesController {
  constructor(private expensesService: ExpensesServices) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria uma nova despesa.' })
  @ApiCreatedResponse({ description: 'Despesa criada com sucesso' })
  @ApiBadRequestResponse({
    description:
      'Despesa não pode ser criada. Verifique os campos e tente novamente',
  })
  create(@Req() req: Request, @Body() body: CreateExpensesDTO) {
    const user = req.user as { sub: string };

    return this.expensesService.create({
      ...body,
      userId: user.sub,
    });
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da despesa',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateExpensesDTO,
  ) {
    const user = req.user as { sub: string };

    return this.expensesService.update(id, user.sub, body);
  }

  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todas as despesas do usuário logado' })
  findAll(
    @Req() req: Request,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = req.user as { sub: string };

    return this.expensesService.findAll(
      user.sub,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da despesa',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  async findById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Expenses> {
    const user = req.user as { sub: string };

    return this.expensesService.findById(id, user.sub);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da despesa',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: string };

    return this.expensesService.remove(id, user.sub);
  }

  @Get('summary/month')
  @ApiOperation({
    summary: 'Resumo das despesas do mês corrente',
    description:
      'Retorna a soma total das despesas, a quantidade de despesas, o total gasto por tipo de pagamento (debit e voucher) e a data da última compra realizada no mês corrente.',
  })
  @ApiOkResponse({
    description: 'Resumo mensal das despesas',
    schema: {
      type: 'object',
      properties: {
        totalAmount: {
          type: 'number',
          example: 1250.75,
        },
        totalExpenses: {
          type: 'number',
          example: 8,
        },
        totalDebit: {
          type: 'number',
          example: 830.25,
          description: 'Total gasto com pagamento via débito',
        },
        totalVoucher: {
          type: 'number',
          example: 420.5,
          description: 'Total gasto com pagamento via voucher',
        },
        lastPurchaseDate: {
          type: 'string',
          format: 'date-time',
          example: '2026-02-18T20:11:00.000Z',
          nullable: true,
        },
      },
    },
  })
  async getMonthlySummary(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.expensesService.getMonthlySummary(userId);
  }
}
