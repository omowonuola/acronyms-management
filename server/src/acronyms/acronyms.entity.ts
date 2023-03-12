import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'acronyms',
})
export class AcronymEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({
    example: 'WFH',
    description: 'The Acronym',
  })
  @Column()
  acronym: string;

  @ApiProperty({
    example: 'Work From Home',
    description: 'Definition of the acronym',
  })
  @Column()
  definition: string;
}

export type paginationResponse = {
  data: object;
  total: number;
  page: number;
  pageSize: number;
};
