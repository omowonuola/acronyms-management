import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthRepository } from './auth.repository';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository, // private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return this.authRepository.createUser(authCredentialsDto);
  }

  //   async signIn(
  //     authCredentialsDto: AuthCredentialsDto,
  //   ): Promise<{ accessToken: string }> {
  //     const { username, password } = authCredentialsDto;
  //     const user = await this.usersRepository.findOne({ username });

  //     if (user && (await bcrypt.compare(password, user.password))) {
  //       const payload: JwtPayload = { username };
  //       const accessToken: string = await this.jwtService.sign(payload);
  //       return { accessToken };
  //     } else {
  //       throw new UnauthorizedException('Please check your login credentials');
  //     }
  //   }
}
