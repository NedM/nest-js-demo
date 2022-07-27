import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'Name of a coffee.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Brand that makes the coffee.' })
  @IsString()
  readonly brand: string;

  @ApiProperty({
    description: 'Flavors you might detect when drinking the coffee.',
  })
  @IsString({ each: true })
  readonly flavors?: string[];

  @ApiProperty({
    description: 'Roast description.',
    examples: ['dark', 'light', 'medium', 'blond'],
  })
  @IsString()
  readonly roast?: string;

  @ApiProperty({
    description:
      'Where the coffee came from. Where it was grown and harvested.',
  })
  @IsString()
  readonly provenance?: string;
}
