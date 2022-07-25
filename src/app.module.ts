import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres', // type of our database
        host: process.env.DATABASE_HOST, // database host
        port: +process.env.DATABASE_PORT, // database port
        username: process.env.DATABASE_USER, // username (default)
        password: process.env.DATABASE_PASSWORD, // user password (from docker-compose)
        database: process.env.DATABASE_NAME, // name of our database (default)
        autoLoadEntities: true, // models will be loaded automatically
        synchronize: true, // your entities will be synced with the database (recommended: disable in prod)
      }),
    }),
    CoffeesModule,
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
    }),
    CoffeeRatingModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
