import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffees.constants';

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
      useValue: ['Probulate', 'Brio', 'Green Mountain'],
    },
  ],
})
export class CoffeesModule {}
