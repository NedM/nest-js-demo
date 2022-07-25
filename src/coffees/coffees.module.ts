import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  exports: [CoffeesService],
  controllers: [CoffeesController],
  providers: [
    {
      provide: CoffeesService,
      useClass: CoffeesService,
    },
    {
      provide: COFFEE_BRANDS,
      useFactory: async (dataSource: DataSource): Promise<string[]> => {
        // const coffeeBrands = await dataSource.query('SELECT * FROM ...');
        const coffeeBrands = await Promise.resolve([
          'Probulate',
          'Brio',
          'Green Mountain',
        ]);
        console.log('coffeeBrands factory ASYNC function');
        return coffeeBrands;
      },
    },
  ],
})
export class CoffeesModule {}
