import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        { provide: COFFEE_BRANDS, useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    describe('when coffee with specified ID exists', () => {
      it('should return the matching record', async () => {
        const coffeeId = '1';
        const expected = { what: 'I am coffee', who: 'I am coffee' };

        coffeeRepository.findOne.mockReturnValue(expected);
        const found = await service.find(+coffeeId);
        expect(found).toEqual(expected);
      });
    });

    describe('when the coffee with the specified ID does not exist', () => {
      it('should throw the expected exception', async () => {
        const coffeeId = '1';

        coffeeRepository.findOne.mockReturnValue(undefined);
        // try {
        //   await service.find(+coffeeId);
        //   expect(true).toBeFalsy();
        // } catch (ex) {
        //   expect(ex).toBeInstanceOf(NotFoundException);
        //   expect(ex.message).toBe(`Coffee id: ${coffeeId} not found!`);
        // }

        // const op = async () => await service.find(+coffeeId);
        // await expect(op).rejects.toThrow(
        await expect(service.find(+coffeeId)).rejects.toThrow(
          new NotFoundException(`Coffee id: ${coffeeId} not found!`),
        );
      });
    });
  });
});
