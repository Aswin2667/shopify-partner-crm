import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import validationPipeConfig from './common/pipes/validation-pipe.config';
import { ValidationPipe } from '@nestjs/common';
import { CustomInterceptors } from './common/interceptors/response.interceptor';
import { CustomExceptionFilter } from './common/exceptions/errors.exception';
import { setupSwagger } from './config/swagger.config';
import { MailService } from '@org/utils';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    BigInt.prototype['toJSON'] = function () {
      return this.toString();
    };
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    app.useGlobalInterceptors(new CustomInterceptors());
    app.useGlobalFilters(new CustomExceptionFilter());
    app.enableCors();

    app.use(helmet());
    setupSwagger(app);
    await app.listen(8080);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
