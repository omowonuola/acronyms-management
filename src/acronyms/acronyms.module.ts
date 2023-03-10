import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcronymsController } from './acronyms.controller';
import { AcronymEntity } from './acronyms.entity';
import { AcronymRepository } from './acronyms.repository';
import { AcronymService } from './acronyms.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcronymEntity])],
  controllers: [AcronymController],
  providers: [AcronymService, AcronymRepository],
})
export class AcronymsModule {}