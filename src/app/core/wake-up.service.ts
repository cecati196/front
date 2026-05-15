import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WakeUpService {
  private wakingSubject = new BehaviorSubject<boolean>(false);
  waking$ = this.wakingSubject.asObservable();

  constructor(private http: HttpClient) {}

  markAsWaking(): void {
    if (!this.wakingSubject.getValue()) this.wakingSubject.next(true);
  }

  markAsReady(): void {
    if (this.wakingSubject.getValue()) this.wakingSubject.next(false);
  }

  async warmUp(): Promise<void> {
    try {
      await firstValueFrom(this.http.get(`${environment.apiUrl}/health`));
    } catch {
      // El RetryInterceptor maneja los reintentos; si tras todos los intentos
      // sigue fallando, el indicador se ocultará en el finalize del interceptor.
    } finally {
      this.markAsReady();
    }
  }
}
