import {
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateExpensesDTO } from './dtos/create-expense.dto';
import { UpdateExpensesDTO } from './dtos/update-expenses.dto';
import { UpdateExpenseUseCase } from './use-cases/update-expense.usecase';
import { DeleteExpenseUseCase } from './use-cases/delete-expense.usecase';
import { CreateExpenseUseCase } from './use-cases/create-expense.usecase';
import { AuthenticatedRequest } from 'src/interfaces/AuthenticatedRequest';
import { GetMonthlySummaryUseCase } from './use-cases/get-monthly-summary';
import { FindAllExpensesUseCase } from './use-cases/find-all-expenses.usecase';
import { FindExpenseByIdUseCase } from './use-cases/find-expense-by-id.usecase';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase,
    private readonly findExpenseByIdUseCase: FindExpenseByIdUseCase,
    private readonly findAllExpensesUseCase: FindAllExpensesUseCase,
    private readonly getMonthlySummaryUseCase: GetMonthlySummaryUseCase,
  ) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateExpensesDTO,
  ) {
    return this.createExpenseUseCase.execute({
      ...body,
      userId: req.user.sub,
    });
  }

  @Get('/all')
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.findAllExpensesUseCase.execute(
      req.user.sub,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Patch(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateExpensesDTO,
  ) {
    return this.updateExpenseUseCase.execute(id, req.user.sub, body);
  }

  @Get(':id')
  async findById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.findExpenseByIdUseCase.execute(id, req.user.sub);
  }

  @Delete(':id')
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.deleteExpenseUseCase.execute(id, req.user.sub);
  }

  @Get('summary/month')
  async getMonthlySummary(@Req() req: AuthenticatedRequest) {
    return this.getMonthlySummaryUseCase.execute(req.user.sub);
  }
}
