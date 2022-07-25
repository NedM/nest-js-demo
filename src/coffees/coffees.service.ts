import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination_query.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRespository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log('Brands:', coffeeBrands);
    console.log(
      `CoffeesService initialized!\n  Coffees Config: ${JSON.stringify(
        coffeesConfiguration,
      )}`,
    );
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    return this.coffeeRepository.find({
      relations: {
        flavors: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async find(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        flavors: true,
      },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee id: ${id} not found!`);
    }

    return coffee;
  }

  async create(coffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      coffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...coffeeDto,
      flavors: flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, coffeeDto: UpdateCoffeeDto) {
    let flavors;
    if (coffeeDto.flavors) {
      flavors = await Promise.all(
        coffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      );
    }

    const coffee = await this.coffeeRepository.preload({
      id: id,
      ...coffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`No coffee with id: ${id} could be found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (exception) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const coffee = await this.find(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlav = await this.flavorRespository.findOne({
      where: { name: name },
    });

    if (existingFlav) {
      return existingFlav;
    }

    return this.flavorRespository.create({ name });
  }
}
