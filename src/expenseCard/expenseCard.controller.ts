import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('ExpenseCard')
@Controller('expenseCard')
@UseGuards(JwtAuthGuard)
export class ExpenseCardController {}
