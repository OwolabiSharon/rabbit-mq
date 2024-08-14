import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class RpcValidationPipe extends ValidationPipe {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
