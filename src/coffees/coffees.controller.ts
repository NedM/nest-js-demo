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

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    if (limit && limit < 1) {
      throw new Error('Limit cannot be less than 1');
    }

    if (offset && offset < 1) {
      throw new Error('Offset cannot be less than 1');
    }

    let message;
    if (limit && offset) {
      message = `Here are ${limit} of your coffees from page: ${offset}`;
    } else {
      message = 'Here are all of your coffees';
    }

    return message;
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return `This action returns coffee with id: ${id}`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return `This action updates coffee with id: ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action will destroy coffee with id: ${id}`;
  }
}
