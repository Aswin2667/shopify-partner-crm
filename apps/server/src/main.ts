import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import validationPipeConfig from './common/pipes/validation-pipe.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CustomInterceptors } from './common/interceptors/response.interceptor';
import { CustomExceptionFilter } from './common/exceptions/errors.exception';
// import { setupSwagger } from './config/swagger.config';
import { MailService } from '@org/utils';
import { ConfigService } from '@nestjs/config';
import path, { join } from 'path';
import { json } from 'express';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    BigInt.prototype['toJSON'] = function () {
      return this.toString();
    };

    console.log(__dirname, '../../../../');

    // Uncomment the lines below to enable global pipes, interceptors, and filters
    // app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    // app.useGlobalInterceptors(new CustomInterceptors());
    // app.useGlobalFilters(new CustomExceptionFilter());

    app.enableCors({ origin: '*' });
    app.use(json({ limit: '5mb' }));
    app.use(helmet());
    // setupSwagger(app);

    await app.listen(PORT);

    // Get the active PID and log it along with the port
    const pid = process.pid;
    Logger.log(`Application is running on: ${await app.getUrl()}`);
    Logger.log(`Active PID: ${pid}`);
    Logger.log(`Listening on port: ${PORT}`);
  } catch (error) {
    console.log(error);
    Logger.log(error);
  }
}

bootstrap();
