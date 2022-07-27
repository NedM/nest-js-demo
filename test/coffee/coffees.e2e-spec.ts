import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { CoffeesModule } from '../../src/coffees/coffees.module';

describe('[Feature] Coffees - /coffees', () => {
  const testCoffee = {
    name: 'Testament',
    brand: 'Probulate',
    flavors: ['metallic', 'burning', 'ions'],
    roast: 'in progress',
    provenance: 'beyond',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('Create with POST', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(testCoffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedCoffee = expect.objectContaining({
          ...testCoffee,
          flavors: expect.arrayContaining(
            testCoffee.flavors.map((flavor) =>
              expect.objectContaining({ name: flavor }),
            ),
          ),
        });

        expect(body).toEqual(expectedCoffee);
      });
  });
  it.todo('Get all with GET');
  it.todo('Get one with GET(:id)');
  it.todo('Update one with PATCH(:id)');
  it.todo('Destroy one with DELETE(:id)');

  afterAll(async () => {
    await app.close();
  });
});
