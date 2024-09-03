import { NestFactory } from '@nestjs/core';
import { DataSourceModule } from './data-source.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(DataSourceModule);
  await app.init();
}
bootstrap();
