import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

// NestJs includes a validator pipe like this already!
@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const parsedVal = parseInt(value, 10);
    if (isNaN(parsedVal)) {
      throw new BadRequestException(
        `Validation failed! "${value}" is not an integer.`,
      );
    }

    return parsedVal;
  }
}
