import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'acronyms',
})
export class AcronymEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  acronym: string;

  @Column()
  definition: string;
}

export type paginationResponse = {
  data: object;
  total: number;
  page: number;
  pageSize: number;
};
