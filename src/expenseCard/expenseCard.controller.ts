import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExpenseCardService } from './expenseCard.service';
import { CreateExpenseCardDto } from './dtos/create-expense-card.dto';
import { Request } from 'express';

@ApiTags('ExpenseCard')
@Controller('expenseCard')
@UseGuards(JwtAuthGuard)
export class ExpenseCardController {
  constructor(private expenseCardService: ExpenseCardService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria uma nova despesa no cartão.' })
  @ApiCreatedResponse({ description: 'Despesa criada com sucesso' })
  @ApiBadRequestResponse({
    description:
      'Despesa não pode ser criada. Verifique os campos e tente novamente',
  })
  create(@Req() req: Request, @Body() body: CreateExpenseCardDto) {
    const user = req.user as { sub: string };

    return this.expenseCardService.create(body, user.sub);
  }
}
