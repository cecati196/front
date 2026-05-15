import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/services/courses.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { UnsavedChangesService } from 'src/app/core/unsaved-changes.service';
import { Course } from 'src/app/shared/interfaces/course.interface';

@Component({
  selector: 'app-edit-course-form',
  templateUrl: './edit-course-form.component.html',
  styleUrls: ['./edit-course-form.component.css'],
})
export class EditCourseFormComponent implements OnInit, OnDestroy {
  @Output() closeEditCourseForm = new EventEmitter<boolean>();

  private unregisterGuard?: () => void;

  step: 'select' | 'edit' = 'select';

  allCourses:      Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse:  Course | null = null;
  searchText = '';

  loading       = false;
  deleteLoading = false;
  errorMsg:   string | null = null;
  successMsg: string | null = null;

  courseForm: FormGroup;

  listSpecialties: string[] = [];
  listProfessors:  string[] = [];

  typesModality = ['Presencial', 'Remoto', 'Híbrido'];
  typeCourse    = ['Regular', 'Extensión'];

  days: { [key: string]: boolean } = {
    Lunes: false, Martes: false, Miercoles: false,
    Jueves: false, Viernes: false, Sábado: false, Domingo: false,
  };
  lunVie = false;

  constructor(
    private fb:             FormBuilder,
    private coursesService: CoursesService,
    private catalogService: CatalogService,
    private dialog:         DialogService,
    private unsavedChanges: UnsavedChangesService,
  ) {
    this.courseForm = this.fb.group({
      courseName:      ['', Validators.required],
      specialty:       ['', Validators.required],
      thematicContent: [''],
      objective:       [''],
      startTime:       ['', Validators.required],
      endTime:         ['', Validators.required],
      startDate:       ['', Validators.required],
      endDate:         ['', Validators.required],
      daysOfClasses:   ['', Validators.required],
      cost:            ['', Validators.required],
      professor:       ['', Validators.required],
      hours:           ['', Validators.required],
      courseType:      ['', Validators.required],
      courseModality:  ['Presencial', Validators.required],
      searchPhrase:    [''],
      observations:    [''],
    });
  }

  ngOnInit(): void {
    this.unregisterGuard = this.unsavedChanges.register(
      () => this.step === 'edit' && this.courseForm.dirty,
    );

    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.allCourses      = courses;
        this.filteredCourses = courses;
      },
      error: () => (this.errorMsg = 'Error al cargar los cursos'),
    });

    this.catalogService.getSpecialties().subscribe({
      next: items => this.listSpecialties = items.map(s => s.name),
    });
    this.catalogService.getProfessors().subscribe({
      next: items => this.listProfessors = items.map(p => p.name),
    });
  }

  ngOnDestroy(): void {
    this.unregisterGuard?.();
  }

  filterList(): void {
    const q = this.searchText.toLowerCase();
    this.filteredCourses = this.allCourses.filter(c =>
      c.courseName.toLowerCase().includes(q) ||
      (c.specialty ?? '').toLowerCase().includes(q)
    );
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
    this.errorMsg   = null;
    this.successMsg = null;
    this.courseForm.patchValue({
      courseName:      course.courseName,
      specialty:       course.specialty,
      thematicContent: course.thematicContent ?? '',
      objective:       course.objective       ?? '',
      startTime:       course.startTime,
      endTime:         course.endTime,
      startDate:       course.startDate,
      endDate:         course.endDate,
      daysOfClasses:   course.daysOfClasses,
      cost:            course.cost,
      professor:       course.professor,
      hours:           course.hours,
      courseType:      course.courseType,
      courseModality:  course.courseModality,
      searchPhrase:    course.searchPhrase ?? '',
      observations:    course.observations  ?? '',
    });
    this.parseDays(course.daysOfClasses ?? '');
    this.step = 'edit';
  }

  backToList(): void {
    this.step           = 'select';
    this.selectedCourse = null;
    this.errorMsg       = null;
    this.successMsg     = null;
    this.courseForm.reset({ courseModality: 'Presencial' });
    this.parseDays('');
  }

  onDayChange(): void {
    const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    this.lunVie = weekdays.every(d => this.days[d]) &&
                  !this.days['Sábado'] && !this.days['Domingo'];
    this.courseForm.get('daysOfClasses')?.setValue(this.formatDays());
  }

  onLunVieChange(): void {
    const v = this.lunVie;
    ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'].forEach(d => this.days[d] = v);
    this.onDayChange();
  }

  private formatDays(): string {
    const ORDER = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const selected = ORDER.filter(d => this.days[d]);
    if (!selected.length) return '';
    if (selected.length === 1) return selected[0];
    const indices = selected.map(d => ORDER.indexOf(d));
    const isConsecutive = indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1);
    if (isConsecutive) return `${selected[0]} a ${selected[selected.length - 1]}`;
    if (selected.length === 2) return `${selected[0]} y ${selected[1]}`;
    return `${selected.slice(0, -1).join(', ')} y ${selected[selected.length - 1]}`;
  }

  private parseDays(str: string): void {
    const ORDER = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    ORDER.forEach(d => this.days[d] = false);
    this.lunVie = false;
    if (!str?.trim()) return;

    const normalized = str.trim().replace(/Sábados/g, 'Sábado');

    if (normalized.includes(' a ')) {
      const parts    = normalized.split(' a ');
      const fromIdx  = ORDER.indexOf(parts[0].trim());
      const toIdx    = ORDER.indexOf(parts[1].trim());
      if (fromIdx !== -1 && toIdx !== -1) {
        for (let i = fromIdx; i <= toIdx; i++) this.days[ORDER[i]] = true;
      }
    } else {
      normalized.replace(/ y /g, ', ').split(', ')
        .map(d => d.trim())
        .filter(d => ORDER.includes(d))
        .forEach(d => this.days[d] = true);
    }

    const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    this.lunVie = weekdays.every(d => this.days[d]) && !this.days['Sábado'] && !this.days['Domingo'];
  }

  onSubmit(): void {
    if (this.courseForm.invalid || !this.selectedCourse?.id) return;
    this.loading  = true;
    this.errorMsg = null;

    const data: Course = { ...this.courseForm.value };

    this.coursesService.updateCourse(this.selectedCourse.id, data).subscribe({
      next: (updated) => {
        const idx = this.allCourses.findIndex(c => c.id === updated.id);
        if (idx !== -1) this.allCourses[idx] = updated;
        this.filterList();
        this.loading    = false;
        this.successMsg = 'Curso actualizado correctamente';
        setTimeout(() => this.closeEditCourseForm.emit(false), 1500);
      },
      error: () => {
        this.errorMsg = 'Error al actualizar el curso';
        this.loading  = false;
      },
    });
  }

  async onDelete(): Promise<void> {
    if (!this.selectedCourse?.id) return;
    const confirmed = await this.dialog.openConfirm(
      `¿Eliminar el curso "${this.selectedCourse.courseName}"? Esta acción no se puede deshacer.`,
      { confirmLabel: 'Eliminar', isDangerous: true },
    );
    if (!confirmed) return;

    this.deleteLoading = true;
    this.errorMsg      = null;

    this.coursesService.deleteCourse(this.selectedCourse.id).subscribe({
      next: () => {
        this.allCourses = this.allCourses.filter(c => c.id !== this.selectedCourse!.id);
        this.filterList();
        this.deleteLoading = false;
        this.successMsg    = 'Curso eliminado correctamente';
        setTimeout(() => this.closeEditCourseForm.emit(false), 1500);
      },
      error: () => {
        this.errorMsg      = 'Error al eliminar el curso';
        this.deleteLoading = false;
      },
    });
  }

  cancel(): void {
    this.closeEditCourseForm.emit(false);
  }
}
