import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDTO {
  @ApiProperty()
  acessToken: string;

  @ApiProperty()
  refreshToken: string;
}
