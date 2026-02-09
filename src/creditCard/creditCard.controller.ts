import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreditCardServices } from './creditCard.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCreditCardDto } from './dtos/create-credit-card.dto';
import { Request } from 'express';

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
}
