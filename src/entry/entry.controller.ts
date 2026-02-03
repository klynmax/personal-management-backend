import { ApiBadRequestResponse, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EntryServices } from './entry.service';
import { CreateEntryDTO } from './dtos/create-entry.dto';
import { Request } from 'express';

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
}
