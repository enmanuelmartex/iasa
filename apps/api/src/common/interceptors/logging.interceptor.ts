import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { redactUrl } from '../utils/redact.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    // SSE authenticates via `?token=<jwt>` because EventSource cannot set
    // headers, so the raw URL carries a live credential. Redact before logging.
    const safeUrl = redactUrl(url);
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const duration = Date.now() - start;
        this.logger.log(`${method} ${safeUrl} ${res.statusCode} — ${duration}ms`);
      }),
    );
  }
}
