import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService } from '../dialog/dialog.service';
import { UnsavedChangesService } from '../../core/unsaved-changes.service';
import { SchoolControlStateService } from '../../core/school-control-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private router:             Router,
    private dialog:             DialogService,
    private unsavedChanges:     UnsavedChangesService,
    private schoolControlState: SchoolControlStateService,
  ) {}

  closeNav(): void {
    const menu = document.querySelector('#toggle') as HTMLInputElement | null;
    if (menu) menu.checked = false;
  }

  async navigateTo(path: string): Promise<void> {
    this.closeNav();

    if (this.unsavedChanges.hasUnsavedChanges()) {
      const confirmed = await this.dialog.openConfirm(
        'Los cambios realizados no se guardarán al salir de esta pantalla. ¿Deseas continuar?',
        { title: 'Cambios sin guardar', confirmLabel: 'Salir sin guardar', isDangerous: true },
      );
      if (!confirmed) return;
    }

    if (path === '/control-escolar' && this.router.url.startsWith('/control-escolar')) {
      this.schoolControlState.triggerReset();
      return;
    }

    this.router.navigateByUrl(path);
  }
}
