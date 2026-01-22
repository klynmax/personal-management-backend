import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersServices {
  private users = [
    {
      id: 1,
      name: 'Luiz Inácio',
      email: 'fazol@email.com',
      password: '123',
    },
    {
      id: 2,
      name: 'Flávio Caça Rato',
      email: 'paidemagrao@email.com',
      password: '123',
    },
    {
      id: 3,
      name: 'Eliza Sanches',
      email: 'sanches_ousadah@email.com',
      password: '123',
    },
  ];

  findAll() {}
}
