import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry, finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { WakeUpService } from './wake-up.service';

// Códigos que indican servicio dormido / arrancando / inalcanzable temporalmente.
//   0   → error de red (sin respuesta del servidor)
//   408 → request timeout
//   502 → bad gateway
//   503 → service unavailable
//   504 → gateway timeout
const TRANSIENT_STATUSES = [0, 408, 502, 503, 504];

const MAX_RETRIES     = 4;
const INITIAL_DELAY   = 1000;   // ms
const MAX_DELAY       = 10_000; // ms

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  constructor(private wake: WakeUpService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (error, retryCount) => {
          if (!(error instanceof HttpErrorResponse) || !TRANSIENT_STATUSES.includes(error.status)) {
            return throwError(() => error);
          }
          this.wake.markAsWaking();
          const ms = Math.min(INITIAL_DELAY * 2 ** (retryCount - 1), MAX_DELAY);
          return timer(ms);
        },
      }),
      finalize(() => this.wake.markAsReady()),
    );
  }
}
