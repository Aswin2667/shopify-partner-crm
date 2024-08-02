import {
  UnprocessableEntityException,
  ValidationPipeOptions,
} from '@nestjs/common';

const validationPipeConfig: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors) => {
    const formattedErr = errors.reduce((accumulator, error) => {
      accumulator[error.property] = Object.values(error.constraints).join(', ');
      return accumulator;
    }, {});
    throw new UnprocessableEntityException(formattedErr);
  },
};

export default validationPipeConfig;
