import { ApiProperty } from '@nestjs/swagger';
import { LevelUsersType } from 'src/enum/users.enum';

export class MeResponseDTO {
  @ApiProperty({ example: '65cfa2d7e7f1b2a9c4e9a123' })
  id: string;

  @ApiProperty({ example: 'João Pedro' })
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  level: LevelUsersType;

  @ApiProperty({ example: '11999999999' })
  phone: string;
}
