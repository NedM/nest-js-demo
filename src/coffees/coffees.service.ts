import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  // private coffees: Coffee[] = [
  //   {
  //     id: 1,
  //     name: 'Test roast',
  //     brand: 'Green Mountain',
  //     flavors: ['Burnt', 'Earth', 'Fermentation'],
  //     roast: 'dark',
  //     provenance: 'Basement',
  //   },
  //   {
  //     id: 2,
  //     name: 'Test roast, best roast, boast roast!',
  //     brand: 'Probulate coffees',
  //     flavors: ['amazing', 'incredible', 'quaffable'],
  //     roast: 'entirely',
  //     provenance: 'Probulation station',
  //   },
  //   {
  //     id: 3,
  //     name: 'Tea',
  //     brand: 'False Coffees! Ahahahaha!',
  //     flavors: ['leaf', 'water'],
  //     roast: 'none',
  //     provenance: 'Probulation nation',
  //   },
  // ];

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
  ) {}

  findAll(limit?: number, offset?: number) {
    return this.coffeeRepository.find();
  }

  async find(id: number) {
    const coffee = await this.coffeeRepository.findOne({ where: { id: id } });

    if (!coffee) {
      throw new NotFoundException(`Coffee id: ${id} not found!`);
    }

    return coffee;
  }

  create(coffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(coffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, coffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeeRepository.preload({
      id: id,
      ...coffeeDto,
    });

    if (!coffee) {
      throw new NotFoundException(`No coffee with id: ${id} could be found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.find(id);
    return this.coffeeRepository.remove(coffee);
  }
}
