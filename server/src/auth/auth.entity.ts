import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'trespass',
    description: 'The Username',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    example: 'Password',
    description: 'user password',
  })
  @Column()
  password: string;
}
