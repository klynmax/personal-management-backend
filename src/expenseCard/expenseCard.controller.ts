import {
  Get,
  Req,
  Post,
  Body,
  Query,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiQuery,
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { Request } from 'express';
import { ExpenseCardService } from './expenseCard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateExpenseCardDto } from './dtos/create-expense-card.dto';
@ApiTags('ExpenseCard')
@Controller('expenseCard')
@UseGuards(JwtAuthGuard)
export class ExpenseCardController {
  constructor(private expenseCardService: ExpenseCardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria uma nova despesa no cartão.' })
  @ApiCreatedResponse({ description: 'Despesa criada com sucesso' })
  @ApiBadRequestResponse({
    description:
      'Despesa não pode ser criada. Verifique os campos e tente novamente',
  })
  async create(@Req() req: Request, @Body() body: CreateExpenseCardDto) {
    const user = req.user as { sub: string };

    const data = await this.expenseCardService.create(body, user.sub);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Cartão criado com sucesso',
      data,
    };
  }

  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todas as despesas do cartão do usuário' })
  findAll(
    @Req() req: Request,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = req.user as { sub: string };

    return this.expenseCardService.findAll(
      user.sub,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get('/current-month')
  @ApiOperation({ summary: 'Lista despesas do cartão do mês corrente' })
  @ApiOkResponse({ description: 'Lista retornada com sucesso' })
  findCurrentMonth(@Req() req: Request) {
    const user = req.user as { sub: string };

    return this.expenseCardService.findCurrentMonth(user.sub);
  }
}
