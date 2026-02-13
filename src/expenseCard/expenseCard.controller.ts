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
  Put,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiResponse,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { Request } from 'express';
import { ExpenseCardService } from './expenseCard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateExpenseCardDto } from './dtos/create-expense-card.dto';
import { UpdateExpenseCardDto } from './dtos/update-expense-card.dto';
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

  // @Put(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Editar despesa parcelada do cartão' })
  // @ApiParam({
  //   name: 'id',
  //   description: 'ID agrupador das parcelas',
  //   example: '65f1c2e8a9f1a23b4c567890',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Despesa atualizada com sucesso',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Cartão ou despesa não encontrada',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Erro de validação',
  // })
  // async update(
  //   @Param('id') parentExpenseId: string,
  //   @Req() req: Request,
  //   @Body() body: UpdateExpenseCardDto,
  // ) {
  //   const user = req.user as { sub: string };

  //   const data = await this.expenseCardService.update(
  //     { ...body, parentExpenseId },
  //     user.sub,
  //   );

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Despesa atualizada com sucesso',
  //     data,
  //   };
  // }

  @Put(':parentExpenseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Editar despesa parcelada do cartão' })
  @ApiParam({
    name: 'parentExpenseId',
    description: 'ID agrupador das parcelas',
    example: '65f1c2e8a9f1a23b4c567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Despesa atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Cartão ou despesa não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
  })
  async update(
    @Param('parentExpenseId') parentExpenseId: string,
    @Req() req: Request,
    @Body() body: UpdateExpenseCardDto,
  ) {
    const user = req.user as { sub: string };

    // const data = await this.expenseCardService.update(
    //   { ...body, parentExpenseId },
    //   user.sub,
    // );

    const data = await this.expenseCardService.update(
      parentExpenseId,
      body,
      user.sub,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Despesa atualizada com sucesso',
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
