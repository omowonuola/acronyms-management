import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAcronymDto {
  @ApiProperty({
    example: 'G2G',
    description: 'Acronym Title',
  })
  @IsString()
  acronym: string;

  @ApiProperty({
    example: 'Good to Go',
    description: 'The Acronym Definition',
  })
  @IsString()
  definition: string;
}
