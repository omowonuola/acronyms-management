import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcronymEntity } from './acronyms/acronyms.entity';
import { ConfigModule } from '@nestjs/config';
import { AcronymsModule } from './acronyms/acronyms.module';
import { AuthEntity } from './auth/auth.entity';
import { AuthModule } from './auth/auth.module';
import { configValidation } from './acronyms/schema.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidation,
    }),
    AcronymsModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [AcronymEntity, AuthEntity],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
