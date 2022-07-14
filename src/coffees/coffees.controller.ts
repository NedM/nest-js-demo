import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    if (limit && limit < 1) {
      throw new Error('Limit cannot be less than 1');
    }

    if (offset && offset < 1) {
      throw new Error('Offset cannot be less than 1');
    }

    return this.coffeesService.findAll(limit, offset);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.coffeesService.find(+id);
  }

  @Post()
  create(@Body() body) {
    this.coffeesService.create(body);
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.coffeesService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(+id);
  }
}
