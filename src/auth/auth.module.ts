import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { AuthEntity } from './auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity])],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
