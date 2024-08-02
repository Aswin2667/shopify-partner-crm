import { NestFactory } from '@nestjs/core';
import { UtilsModule } from './utils.module';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(UtilsModule);
  await app.init();
}
bootstrap();
