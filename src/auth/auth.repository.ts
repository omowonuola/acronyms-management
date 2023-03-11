import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import * as bcrypt from 'bcrypt';

export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);
  constructor(
    @InjectRepository(AuthEntity)
    private userEntity: Repository<AuthEntity>,
  ) {}

  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthEntity> {
    const { username, password } = authCredentialsDto;

    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userEntity.create({ username, password });

    try {
      return await this.userEntity.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // checking for duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
