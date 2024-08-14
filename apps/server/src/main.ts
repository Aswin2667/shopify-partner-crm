import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import validationPipeConfig from './common/pipes/validation-pipe.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CustomInterceptors } from './common/interceptors/response.interceptor';
import { CustomExceptionFilter } from './common/exceptions/errors.exception';
import { setupSwagger } from './config/swagger.config';
import { MailService } from '@org/utils';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    BigInt.prototype['toJSON'] = function () {
      return this.toString();
    };
    // app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    // app.useGlobalInterceptors(new CustomInterceptors());
    // app.useGlobalFilters(new CustomExceptionFilter());
    app.enableCors({ origin: '*' });

    app.use(helmet());
    setupSwagger(app);
    await app.listen(process.env.BACKEND_PORT || 8080);
    // await app.listen(configService.get<number>('BACKEND_PORT'));

    Logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.log(error);
    Logger.log(error);
  }
}
bootstrap();
