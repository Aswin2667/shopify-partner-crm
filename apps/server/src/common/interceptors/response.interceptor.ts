import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class CustomInterceptors implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((output) => {
        let res = null;
        if (output?.success) {
          res = {
            statusCode: HttpStatus.OK,
            message: output.message ?? 'Success',
            data: output.data ?? {},
            success: true,
          };
        }
        return res;
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
