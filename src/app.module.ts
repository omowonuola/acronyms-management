import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcronymEntity } from './acronyms/acronyms.entity';
import { ConfigModule } from '@nestjs/config';
import { AcronymsModule } from './acronyms/acronyms.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AcronymsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [AcronymEntity],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
