import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return this.authRepository.createUser(authCredentialsDto);
  }

  async signInUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authRepository.signInUser(authCredentialsDto);
  }
}
