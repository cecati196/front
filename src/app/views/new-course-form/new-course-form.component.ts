import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/services/courses.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { Course } from 'src/app/shared/interfaces/course.interface';

@Component({
  selector: 'app-new-course-form',
  templateUrl: './new-course-form.component.html',
  styleUrls: ['./new-course-form.component.css']
})
export class NewCourseFormComponent implements OnInit {
  @Output() closeNewCourseForm: EventEmitter<boolean> = new EventEmitter();

  public courseForm: FormGroup;
  public course: Course;

  public phrases: string[] = [];
  public listSpecialties: string[] = [];
  public listProfessors:  string[] = [];
  public phraseInput = '';

  constructor(
    private formBuilder:    FormBuilder,
    private coursesService: CoursesService,
    private catalogService: CatalogService,
    private dialog:         DialogService,
  ) {
    this.courseForm = this.formBuilder.group({
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
    this.course = {
      courseName: '', specialty: '', thematicContent: '', objective: '',
      startTime: '', endTime: '', startDate: '', endDate: '',
      daysOfClasses: '', cost: '', professor: '', hours: '',
      courseType: '', courseModality: '', searchPhrase: '', observations: '',
    };
  }

  ngOnInit(): void {
    this.catalogService.getSpecialties().subscribe({
      next: items => this.listSpecialties = items.map(s => s.name),
    });
    this.catalogService.getProfessors().subscribe({
      next: items => this.listProfessors = items.map(p => p.name),
    });
  }

  cancelAddCourse(): void {
    this.closeNewCourseForm.emit(false);
  }

  addNewCourse(): void {
    if (this.courseForm.status === 'VALID') {
      this.course = { ...this.courseForm.value };
      this.coursesService.newCourse(this.course).subscribe({
        next: () => {
          this.dialog.openAlert('Curso registrado correctamente').then(() => {
            this.phrases = [];
            this.phraseInput = '';
            this.closeNewCourseForm.emit(false);
          });
        },
        error: () => this.dialog.openAlert('Error al registrar el curso. Intenta de nuevo.'),
      });
    } else {
      this.dialog.openAlert('Completa los campos obligatorios');
    }
  }

  addPhrase(): void {
    const phrase = this.phraseInput.trim();
    if (!phrase || this.phrases.includes(phrase)) return;
    this.phrases.push(phrase);
    this.phraseInput = '';
    this.syncPhrases();
  }

  removePhrase(index: number): void {
    this.phrases.splice(index, 1);
    this.syncPhrases();
  }

  private syncPhrases(): void {
    this.courseForm.get('searchPhrase')?.setValue(this.phrases.join(', '));
  }

  days: { [key: string]: boolean } = {
    Lunes: false, Martes: false, Miercoles: false,
    Jueves: false, Viernes: false, Sábado: false, Domingo: false,
  };
  lunVie = false;

  onDayChange(): void {
    const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    this.lunVie = weekdays.every(d => this.days[d]) &&
                  !this.days['Sábado'] && !this.days['Domingo'];
    this.courseForm.get('daysOfClasses')?.setValue(this.formatDays());
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

  onLunVieChange(): void {
    const v = this.lunVie;
    ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'].forEach(d => this.days[d] = v);
    this.onDayChange();
  }

  public typesModality = ['Presencial', 'Remoto', 'Hibrido'];
  public typeCourse    = ['Regular', 'Extensión'];
}
