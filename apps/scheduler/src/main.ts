import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };
  await app.listen(process.env.PORT || 8081);
}
bootstrap();
