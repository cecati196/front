import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogState {
  type:         'alert' | 'confirm';
  message:      string;
  title?:       string;
  confirmLabel: string;
  isDangerous:  boolean;
  resolve:      (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private stateSubject = new Subject<DialogState | null>();
  state$ = this.stateSubject.asObservable();

  openAlert(message: string, title?: string): Promise<void> {
    return new Promise(res => {
      this.stateSubject.next({
        type: 'alert', message, title,
        confirmLabel: 'Aceptar',
        isDangerous: false,
        resolve: () => { this.stateSubject.next(null); res(); },
      });
    });
  }

  openConfirm(
    message: string,
    options?: { title?: string; confirmLabel?: string; isDangerous?: boolean },
  ): Promise<boolean> {
    return new Promise(res => {
      this.stateSubject.next({
        type: 'confirm', message,
        title:        options?.title,
        confirmLabel: options?.confirmLabel ?? 'Confirmar',
        isDangerous:  options?.isDangerous  ?? false,
        resolve: (value) => { this.stateSubject.next(null); res(value); },
      });
    });
  }
}
