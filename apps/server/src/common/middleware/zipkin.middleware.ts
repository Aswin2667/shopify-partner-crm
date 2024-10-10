// zipkin.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Tracer, ExplicitContext, BatchRecorder } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';
import { expressMiddleware } from 'zipkin-instrumentation-express';

@Injectable()
export class ZipkinMiddleware implements NestMiddleware {
  private readonly tracer: Tracer;

  constructor() {
    const zipkinBaseUrl = process.env.ZIPKIN_BASE_URL || 'http://zipkin:9411';

    const ctxImpl = new ExplicitContext();
    const recorder = new BatchRecorder({
      logger: new HttpLogger({
        endpoint: `${zipkinBaseUrl}/api/v1/spans`
      })
    });

    this.tracer = new Tracer({
      ctxImpl,
      recorder,
      localServiceName: 'server',
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    expressMiddleware({ tracer: this.tracer })(req, res, next);
  }
}
