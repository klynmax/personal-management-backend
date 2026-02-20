<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]:
  https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descrição do framework

[Nest](https://github.com/nestjs/nest) framework TypeScript para aplicação com banco de dados.

## Setup do projeto

```bash
npm install
```

## Compilar e executar o projeto

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Executar testes

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Corrigir erros de lint no código

```bash
npx eslint src --fix
```

## Executar o swagger

```bash
npm run start:dev
```

Acessar no navegador http://localhost:3000/api

## 🏗 Arquitetura do Projeto

Este projeto é uma API desenvolvida com **NestJS**, estruturada com foco em:

- Separação clara de responsabilidades
- Baixo acoplamento entre camadas
- Alta testabilidade
- Escalabilidade modular
- Indepedência de infraestrutura

A arquitetura aplicada é inspirada em **Clean Architecture + DDD tático simplificado**, onde:

- A regra de negócio é isolada
- Infraestrutura é substituível
- Controllers são apenas adaptadores
- Casos de uso concentram a lógica da aplicação

## 📂 Estrutura geral

```
src
├── auth
├── config
├── creditCard
├── entry
├── enum
├── expenseCard
├── expenses
├── interfaces
├── shared
├── user
```

Todos os módulos de domínio (`creditCard`, `entry`, `expenseCard`, `user`) seguem o mesmo padrão estrutural.

## 🔐 Módulo Auth

Responsável por autenticação e autorização.

```
auth
├── dto
├── guards
├── strategies
├── auth.controller.ts
├── auth.module.ts
└── auth.service.ts
```

#### 📁 dto/

Define contratos de entrada e saída:

- `login.dto.ts`
- `auth-response.dto.ts`
- `me-response.ts`

#### 📁 guards/

Proteção de rotas:

- `jwt-auth.guard.ts`
- `refresh-auth.guard.ts`

#### 📁 strategies/

Estratégias do Passport:

- `jwt.strategy.ts`
- `refresh.strategy.ts`

Responsável por validar tokens e popular o `Request.user`.

#### 📄 auth.service.ts

Contém regras relacionadas a:

- Login
- Geração de tokens
- Refresh token
- Validação de credencias

📄 auth.controller.ts

Camada HTTP para:

- Login
- Refresh
- Me

## ⚙️ config/

Centraliza configurações globais da aplicação.

Exemplo:

- `Swagger.config.ts`

Responsável por configurar documentação e evitar configuração espalhada pela aplicação.

## 🧾 Módulos de Domínio

Os módulos abaixo seguem a mesma arquitetura interna:

- `creditCard`
- `entry`
- `expenseCard`
- `expenses`
- `user`

Cada um contém:

```
├── constants
├── dtos
├── entities
├── infrastructure
├── repositories
├── use-cases
├── *.controller.ts
└── *.module.ts
```

#### 📁 constants/

- Mensagens de erro
- Códigos internos
- Strings reutilizáveis
- Enums específicos do módulo

Evita repetição e inconsistência.

#### 📁 dtos/

Contratos de entrada/saída da API.

Responsável por:

- Validação
- Tipagem
- Definir formato externo

DTO não tem regra de negócio.

#### 📁 entities/

Definem contratos abstratos de persistência.

Exemplo conceitual:

```
export abstract class ExpenseRepository {
  abstract create(data: Expense): Promise<Expense>;
}
```

UseCases dependem dessa abstração.

#### 📁 infrastructure/

Implementações concretas dos repositórios.

Exemplo:

- `mongoose-*.repository.ts`
- `*.mapper.ts`

Responsável por:

- Comunicação com banco
- Mapeamento entidade ↔ documento
- Isolar Mongoose da regra de negócio

#### 📁 use-cases/

Camada central da aplicação.

Responsável por:

- Orquestrar regras de negócio
- Validar cenários
- Chamar repositórios
- Retornar resultados para controller

UseCases não conhecem:

- HTTP
- Banco
- NestJS
- Mongoose

Apenas regra de negócio.

## 📄 controller.ts

Adaptador HTTP.

Responsável por:

- Receber requisição
- Validar o DTO
- Chamar UseCase
- Retornar resposta

Não contém regra de negócio.

## 📄 module.ts

Arquivo de composição do NestJS.

Responsável por:

- Registrar providers
- Fazer bindings entre abstração e implementação
- Declarar controllers

Aqui ocorre a inversçao de dependência:

```
{
  provide: ExpenseRepository,
  useClass: MongooseExpenseRepository,
}
```

## 📁 enum/

Enums globais reutilizaveis.

Exemplo:

- Tipo de requisição autenticada
- Contratos comuns
- Estrutura reutilizáveis

Serve como ponto de tipagem comum sem acoplar domínios.

## 📁 shared/

Componentes reutilizáveis e transversais.

Pode conter:

- Pipes
- Decorators
- Filtros de exceção
- Utilitários
- Helpers
- Middlewares

Essa pasta evita duplicação e mantém os rótulos limpos.

## 🔄 Fluxo de Execução da Aplicação

**1.** Request chega ao Controller
**2.** DTO valida entrada
**3.** Controller chama UseCase
**4.** UseCase aplica regra de negócio
**5.** UseCase chama Repository (abstração)
**6.** Implementação concreta acessa banco
**7.** Mapper converte dados
**8.** Resultado retorna ao Controller

## 🧠 Princípios Arquiteturais

**Inversão de Dependência**
Camada de negócio depende de abstrações.

**Separação de Responsabilidades**
Cada camada tem função única.

**Baixo Acoplamento**
Infraestrutura pode ser substituída.

**Alta Coesão**
Cada módulo é responsável por seu próprio domínio.

**Testabilidade**
UseCases podem ser testados isoladamente com mocks.

## 📈 Benefícios da Arquitetura

- Crescimento previsível
- Facilidade de manutenção
- Redução de dívida técnica
- Facilidade para novos desenvolvedores
- Troca de banco sem impacto no domínio

## ⚠️ Boas Práticas Importantes

Evitar:

- Regras de negócio no controller
- Acesso direto ao banco de dados dentro de UseCases
- DTO sendo usado como entidade
- Vazamento de detalhes do Mongoose
