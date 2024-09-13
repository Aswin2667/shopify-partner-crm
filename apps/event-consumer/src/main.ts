import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };

  await app.listen(8082);
}
bootstrap();
