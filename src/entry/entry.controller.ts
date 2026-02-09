import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EntryServices } from './entry.service';
import { CreateEntryDTO } from './dtos/create-entry.dto';
import { Request } from 'express';
import { Entry } from 'src/schemas/entry.schema';
import { UpdateEntryDTO } from './dtos/update-entry.dto';

@ApiTags('Entry')
@Controller('entry')
@UseGuards(JwtAuthGuard)
export class EntryController {
  constructor(private entryService: EntryServices) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria uma nova entrada.' })
  @ApiCreatedResponse({ description: 'Entrada criada com sucesso' })
  @ApiBadRequestResponse({
    description:
      'Entrada não pode ser criada. Verifique os campos e tente novamente',
  })
  create(@Req() req: Request, @Body() body: CreateEntryDTO) {
    const user = req.user as { sub: string };

    return this.entryService.create({
      ...body,
      userId: user.sub,
    });
  }

  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todas as entradas do usuário logado' })
  findAll(
    @Req() req: Request,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = req.user as { sub: string };

    return this.entryService.findAll(
      user.sub,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da entrada',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Busca uma entrada a partir do id' })
  async findById(@Req() req: Request, @Param('id') id: string): Promise<Entry> {
    const user = req.user as { sub: string };

    return this.entryService.findById(id, user.sub);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da entrada',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateEntryDTO,
  ) {
    const user = req.user as { sub: string };

    return this.entryService.update(id, user.sub, body);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID da despesa',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: string };

    return this.entryService.remove(id, user.sub);
  }
}
