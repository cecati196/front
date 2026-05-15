import { Component } from '@angular/core';
import { WakeUpService } from './wake-up.service';

@Component({
  selector: 'app-wake-up-indicator',
  template: `
    <div *ngIf="wake.waking$ | async" class="wake-overlay" role="status" aria-live="polite">
      <div class="wake-modal">
        <div class="wake-spinner" aria-hidden="true"></div>
        <p class="wake-title">Conectando con el servidor…</p>
        <p class="wake-hint">Esto puede tardar unos segundos.</p>
      </div>
    </div>
  `,
  styles: [`
    .wake-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .wake-modal {
      background: var(--mainColor);
      border: 2px solid var(--contrastColor);
      border-radius: 12px;
      padding: 28px 36px;
      max-width: 360px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    }

    .wake-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--mainColor2);
      border-top-color: var(--contrastColor);
      border-radius: 50%;
      animation: wake-spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    .wake-title {
      color: var(--fontColor);
      font-size: 1.4rem;
      margin: 0;
    }

    .wake-hint {
      color: var(--fontColor2);
      font-size: 1.2rem;
      margin: 6px 0 0;
    }

    @keyframes wake-spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class WakeUpIndicatorComponent {
  constructor(public wake: WakeUpService) {}
}
