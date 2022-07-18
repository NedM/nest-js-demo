import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavors?: string[];

  @IsString()
  readonly roast?: string;

  @IsString()
  readonly provenance?: string;
}
