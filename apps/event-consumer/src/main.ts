import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  const configService = app.get(ConfigService);

  BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };
  console.log(process.env.BACKEND_PORT);
  await app.listen(process.env.PORT || 8082);
}
bootstrap();
