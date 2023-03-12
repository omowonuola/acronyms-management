import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcronymFilterDto {
  @ApiProperty({
    example: '1',
    description: 'Page Number',
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    example: '20',
    description: 'Limit Per Page',
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    example: 'G2G',
    description: 'Acronym Title Searched',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
