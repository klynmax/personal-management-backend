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
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { CreateEntryDTO } from './dtos/create-entry.dto';
import { UpdateEntryDTO } from './dtos/update-entry.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindByIdUseCase } from './use-case/findById-entry.usecase';
import { DeleteEntryUseCase } from './use-case/delete-entry.usecase';
import { CreateEntryUseCase } from './use-case/create-entry.usecase';
import { UpdateEntryUseCase } from './use-case/update-entry.usecase';
import { FindAllEntryUseCase } from './use-case/findAll-entry.usecase';
import { GetMonthlyEntryUseCase } from './use-case/get-monthly-summary';
import { AuthenticatedRequest } from 'src/interfaces/AuthenticatedRequest';
@ApiTags('Entry')
@Controller('entry')
@UseGuards(JwtAuthGuard)
export class EntryController {
  constructor(
    private readonly findByIdEntryUseCase: FindByIdUseCase,
    private readonly createEntryUseCase: CreateEntryUseCase,
    private readonly updateEntryUseCase: UpdateEntryUseCase,
    private readonly deleteEntryUseCase: DeleteEntryUseCase,
    private readonly findAllEntryUseCase: FindAllEntryUseCase,
    private readonly getMonthlySummaryUseCase: GetMonthlyEntryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova entrada.' })
  @ApiCreatedResponse({ description: 'Entrada criada com sucesso' })
  @ApiBadRequestResponse({
    description:
      'Entrada não pode ser criada. Verifique os campos e tente novamente',
  })
  @ApiOperation({ summary: 'Cria uma nova despesa.' })
  async create(@Req() req: AuthenticatedRequest, @Body() body: CreateEntryDTO) {
    return this.createEntryUseCase.execute({
      ...body,
      userId: req.user.sub,
    });
  }

  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todas as entradas do usuário logado' })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.findAllEntryUseCase.execute(
      req.user.sub,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da entrada',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Atualiza uma despesa.' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateEntryDTO,
  ) {
    return this.updateEntryUseCase.execute(id, req.user.sub, body);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da entrada',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Busca uma entrada a partir do id' })
  async findById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.findByIdEntryUseCase.execute(id, req.user.sub);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da despesa',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Exclui uma entrada' })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.deleteEntryUseCase.execute(id, req.user.sub);
  }

  @Get('summary/month')
  @ApiOperation({ summary: 'Trás um sumário básico das entrada do mês' })
  async getMonthlySummary(@Req() req: AuthenticatedRequest) {
    return this.getMonthlySummaryUseCase.execute(req.user.sub);
  }
}
