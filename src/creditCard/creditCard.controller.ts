import {
  Get,
  Req,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';

import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { Request } from 'express';
import { CreditCardServices } from './creditCard.service';
import { CreditCard } from 'src/schemas/creditCard.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCreditCardDto } from './dtos/create-credit-card.dto';
import { UpdateCreditCardDto } from './dtos/update-credit-card.dto';
import { AuthenticatedRequest } from 'src/interfaces/AuthenticatedRequest';
import { BestCardForPurchaseDto } from './dtos/monthly-credit-card-summary.dto';

@ApiTags('CreditCard')
@Controller('creditCard')
@UseGuards(JwtAuthGuard)
export class CreditCardController {
  constructor(private creditCardService: CreditCardServices) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria um novo cartão.' })
  @ApiCreatedResponse({ description: 'Cartão criado com sucesso' })
  @ApiBadRequestResponse({
    description:
      'Cartão não pode ser criado. Verifique os campos e tente novamente',
  })
  create(@Req() req: Request, @Body() body: CreateCreditCardDto) {
    const user = req.user as { sub: string };

    return this.creditCardService.create({
      ...body,
      userId: user.sub,
    });
  }

  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todas os cartões do usuário logado' })
  findAll(
    @Req() req: Request,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = req.user as { sub: string };

    return this.creditCardService.findAll(
      user.sub,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID do cartão',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Busca um cartão a partir do id' })
  async findById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<CreditCard> {
    const user = req.user as { sub: string };
    return this.creditCardService.findById(id, user.sub);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID do cartão',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Altera um cartão a partir do id' })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateCreditCardDto,
  ) {
    const user = req.user as { sub: string };
    return this.creditCardService.update(id, user.sub, body);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID do cartão',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: string };

    return this.creditCardService.remove(id, user.sub);
  }

  @Get('summary/month')
  @ApiOperation({
    summary: 'Resumo mensal dos cartões',
    description: 'Retorna a descrição do cartão cadastrado pelo usuário',
  })
  @ApiOkResponse({
    description: 'Resumo mensal calculado com sucesso',
    type: BestCardForPurchaseDto,
  })
  async getMonthlySummary(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.creditCardService.getSummary(userId);
  }
}
