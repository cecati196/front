import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchoolControlStateService {
  private resetSubject = new Subject<void>();
  reset$: Observable<void> = this.resetSubject.asObservable();

  triggerReset(): void {
    this.resetSubject.next();
  }
}
