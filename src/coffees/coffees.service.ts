import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Test roast',
      brand: 'Green Mountain',
      flavors: ['Burnt', 'Earth', 'Fermentation'],
      roast: 'dark',
      provenance: 'Basement',
    },
  ];

  findAll(limit?: number, offset?: number) {
    if (
      limit &&
      limit > 0 &&
      limit < this.coffees.length &&
      offset &&
      offset > 0 &&
      offset * limit < this.coffees.length
    ) {
      return this.coffees.slice(offset * limit, (offset + 1) * limit);
    } else {
      return this.coffees;
    }
  }

  find(id: number) {
    const coffee = this.coffees.find((coffee) => coffee.id === id);

    if (!coffee) {
      throw new NotFoundException(`Coffee id: ${id} not found!`);
    }

    return coffee;
  }

  create(coffeeDto: any) {
    this.coffees.push(coffeeDto);
    return coffeeDto;
  }

  update(id: number, coffeeDto: UpdateCoffeeDto) {
    const existingCoffee = this.find(id);
    if (existingCoffee) {
      // Do update
    }
  }

  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    } else {
      console.debug(`Coffee with id: ${id} not found`);
    }
  }
}
