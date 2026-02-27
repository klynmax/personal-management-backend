// import {
//   Get,
//   Req,
//   Body,
//   Post,
//   Param,
//   Patch,
//   Query,
//   Delete,
//   UseGuards,
//   Controller,
// } from '@nestjs/common';

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
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCreditCardUseCase } from './use-cases/create-credit-card.usecase';
import { AuthenticatedRequest } from 'src/interfaces/AuthenticatedRequest';
import { CreateCreditCardDto } from './dtos/create-credit-card.dto';
import { UpdateCreditCardInput } from './entities/update-credit-card';
import { UpdadeCreditCardUseCase } from './use-cases/update-credit-card.usecase';
import { FindByIdCreditCardUseCase } from './use-cases/find-by-id-credit-card.usecase';
import { FindAllCreditCardUseCase } from './use-cases/find-all.usecase';
import { DeleteCreditCardUseCase } from './use-cases/delete-credit-card.usecase';

// import {
//   ApiTags,
//   ApiParam,
//   ApiQuery,
//   ApiConsumes,
//   ApiOperation,
//   ApiOkResponse,
//   ApiCreatedResponse,
//   ApiBadRequestResponse,
// } from '@nestjs/swagger';

// import { Request } from 'express';
// import { CreditCardServices } from './creditCard.service';
// import { CreditCard } from 'src/schemas/creditCard.schema';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CreateCreditCardDto } from './dtos/create-credit-card.dto';
// import { UpdateCreditCardDto } from './dtos/update-credit-card.dto';
// import { AuthenticatedRequest } from 'src/interfaces/AuthenticatedRequest';
// import { BestCardForPurchaseDto } from './dtos/monthly-credit-card-summary.dto';

// @ApiTags('CreditCard')
// @Controller('creditCard')
// @UseGuards(JwtAuthGuard)
// export class CreditCardController {
//   constructor(private creditCardService: CreditCardServices) {}

//   @Post()
//   @ApiConsumes('multipart/form-data')
//   @ApiOperation({ summary: 'Cria um novo cartão.' })
//   @ApiCreatedResponse({ description: 'Cartão criado com sucesso' })
//   @ApiBadRequestResponse({
//     description:
//       'Cartão não pode ser criado. Verifique os campos e tente novamente',
//   })
//   create(@Req() req: Request, @Body() body: CreateCreditCardDto) {
//     const user = req.user as { sub: string };

//     return this.creditCardService.create({
//       ...body,
//       userId: user.sub,
//     });
//   }

//   @Get('/all')
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 10 })
//   @ApiOperation({ summary: 'Busca todas os cartões do usuário logado' })
//   findAll(
//     @Req() req: Request,
//     @Query('page') page?: number,
//     @Query('limit') limit?: number,
//   ) {
//     const user = req.user as { sub: string };

//     return this.creditCardService.findAll(
//       user.sub,
//       Number(page) || 1,
//       Number(limit) || 10,
//     );
//   }

//   @Get(':id')
//   @ApiParam({
//     name: 'id',
//     description: 'ID do cartão',
//     example: '65cfa2d7e7f1b2a9c4e9a123',
//   })
//   @ApiOperation({ summary: 'Busca um cartão a partir do id' })
//   async findById(
//     @Req() req: Request,
//     @Param('id') id: string,
//   ): Promise<CreditCard> {
//     const user = req.user as { sub: string };
//     return this.creditCardService.findById(id, user.sub);
//   }

//   @Patch(':id')
//   @ApiParam({
//     name: 'id',
//     description: 'ID do cartão',
//     example: '65cfa2d7e7f1b2a9c4e9a123',
//   })
//   @ApiOperation({ summary: 'Altera um cartão a partir do id' })
//   update(
//     @Req() req: Request,
//     @Param('id') id: string,
//     @Body() body: UpdateCreditCardDto,
//   ) {
//     const user = req.user as { sub: string };
//     return this.creditCardService.update(id, user.sub, body);
//   }

//   @Delete(':id')
//   @ApiParam({
//     name: 'id',
//     description: 'ID do cartão',
//     example: '65cfa2d7e7f1b2a9c4e9a123',
//   })
//   remove(@Req() req: Request, @Param('id') id: string) {
//     const user = req.user as { sub: string };

//     return this.creditCardService.remove(id, user.sub);
//   }

//   @Get('summary/month')
//   @ApiOperation({
//     summary: 'Resumo mensal dos cartões',
//     description: 'Retorna a descrição do cartão cadastrado pelo usuário',
//   })
//   @ApiOkResponse({
//     description: 'Resumo mensal calculado com sucesso',
//     type: BestCardForPurchaseDto,
//   })
//   async getMonthlySummary(@Req() req: AuthenticatedRequest) {
//     const userId = req.user.sub;
//     return this.creditCardService.getSummary(userId);
//   }
// }

@ApiTags('CreditCard')
@Controller('creditCard')
@UseGuards(JwtAuthGuard)
export class CreditCardController {
  constructor(
    private readonly createCreditCardUseCase: CreateCreditCardUseCase,
    private readonly updateCreditCardUseCase: UpdadeCreditCardUseCase,
    private readonly findByIdCreditCardUseCase: FindByIdCreditCardUseCase,
    private readonly findAllCreditCardUseCase: FindAllCreditCardUseCase,
    private readonly deleteCreditCardUseCase: DeleteCreditCardUseCase,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria um novo cartão.' })
  @ApiCreatedResponse({ description: 'Cartão criado com sucesso' })
  @ApiBadRequestResponse({
    description:
      'Cartão não pode ser criado. Verifique os campos e tente novamente',
  })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateCreditCardDto,
  ) {
    return this.createCreditCardUseCase.execute({
      ...body,
      userId: req.user.sub,
    });
  }

  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOperation({ summary: 'Busca todas os cartões do usuário logado' })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.findAllCreditCardUseCase.execute(
      req.user.sub,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID do cartão',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Altera um cartão a partir do id' })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateCreditCardInput,
  ) {
    return this.updateCreditCardUseCase.execute(id, req.user.sub, body);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID do cartão',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  @ApiOperation({ summary: 'Busca um cartão a partir do id' })
  async findById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.findByIdCreditCardUseCase.execute(id, req.user.sub);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID do cartão',
    example: '65cfa2d7e7f1b2a9c4e9a123',
  })
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.deleteCreditCardUseCase.execute(id, req.user.sub);
  }
}
