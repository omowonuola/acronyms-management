import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAcronymDto {
  @ApiProperty({
    example: 'G2G',
    description: 'Acronym Title',
  })
  @IsNotEmpty()
  @IsString()
  acronym: string;

  @ApiProperty({
    example: 'Good to Go',
    description: 'The Acronym Definition',
  })
  @IsNotEmpty()
  @IsString()
  definition: string;
}
