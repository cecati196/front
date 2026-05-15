import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { Specialty, Professor } from 'src/app/shared/interfaces/catalog.interface';

@Component({
  selector: 'app-catalog-manager',
  templateUrl: './catalog-manager.component.html',
  styleUrls: ['./catalog-manager.component.css'],
})
export class CatalogManagerComponent implements OnInit {
  @Output() closeCatalogManager = new EventEmitter<void>();

  specialties: Specialty[] = [];
  professors:  Professor[]  = [];

  newSpecialty = '';
  newProfessor = '';
  errorMsg: string | null = null;

  constructor(private catalog: CatalogService, private dialog: DialogService) {}

  ngOnInit(): void {
    this.catalog.getSpecialties().subscribe({ next: s => this.specialties = s });
    this.catalog.getProfessors().subscribe({ next: p => this.professors  = p });
  }

  addSpecialty(): void {
    const name = this.newSpecialty.trim();
    if (!name) return;
    this.errorMsg = null;
    this.catalog.addSpecialty(name).subscribe({
      next: item => {
        this.specialties = [...this.specialties, item].sort((a, b) => a.name.localeCompare(b.name));
        this.newSpecialty = '';
      },
      error: err => this.errorMsg = err.error?.message ?? 'Error al agregar especialidad',
    });
  }

  async removeSpecialty(id: number, name: string): Promise<void> {
    const confirmed = await this.dialog.openConfirm(
      `¿Eliminar la especialidad "${name}"? Esta acción no se puede deshacer.`,
      { confirmLabel: 'Eliminar', isDangerous: true },
    );
    if (!confirmed) return;
    this.catalog.removeSpecialty(id).subscribe({
      next: () => this.specialties = this.specialties.filter(s => s.id !== id),
      error: () => this.errorMsg = 'Error al eliminar especialidad',
    });
  }

  addProfessor(): void {
    const name = this.newProfessor.trim();
    if (!name) return;
    this.errorMsg = null;
    this.catalog.addProfessor(name).subscribe({
      next: item => {
        this.professors = [...this.professors, item].sort((a, b) => a.name.localeCompare(b.name));
        this.newProfessor = '';
      },
      error: err => this.errorMsg = err.error?.message ?? 'Error al agregar profesor',
    });
  }

  async removeProfessor(id: number, name: string): Promise<void> {
    const confirmed = await this.dialog.openConfirm(
      `¿Eliminar al profesor "${name}"? Esta acción no se puede deshacer.`,
      { confirmLabel: 'Eliminar', isDangerous: true },
    );
    if (!confirmed) return;
    this.catalog.removeProfessor(id).subscribe({
      next: () => this.professors = this.professors.filter(p => p.id !== id),
      error: () => this.errorMsg = 'Error al eliminar profesor',
    });
  }

  close(): void {
    this.closeCatalogManager.emit();
  }
}
