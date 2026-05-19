import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';

// Códigos que indican server dormido / arrancando / inalcanzable temporalmente.
//   0   → error de red (sin respuesta)
//   408 → request timeout
//   502 → bad gateway
//   503 → service unavailable
//   504 → gateway timeout
const TRANSIENT_STATUSES = [0, 408, 502, 503, 504];

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (error) => {
          if (!(error instanceof HttpErrorResponse) || !TRANSIENT_STATUSES.includes(error.status)) {
            return throwError(() => error);
          }
          return timer(RETRY_DELAY);
        },
      }),
    );
  }
}
