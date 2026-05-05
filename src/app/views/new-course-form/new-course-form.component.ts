import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/services/courses.service';
import { CatalogService } from 'src/app/services/catalog.service';
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
  public phareInput: string = '';

  constructor(
    private formBuilder:    FormBuilder,
    private coursesService: CoursesService,
    private catalogService: CatalogService,
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
      this.coursesService.newCourse(this.course).subscribe((res: any) => {
        console.log(res);
        alert(res.message);
      });
    } else {
      alert('Completa los campos obligatorios');
    }
  }

  newPhrase(eventPhrase: string): void {
    this.phrases.push(eventPhrase);
    this.phareInput = '';
  }

  days: { [key: string]: boolean } = {
    Lunes: false, Martes: false, Miercoles: false,
    Jueves: false, Viernes: false, Sábado: false, Domingo: false,
  };
  lunVie = false;

  onDayChange(): void {
    const selected = Object.entries(this.days)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    this.lunVie = weekdays.every(d => this.days[d]) &&
                  !this.days['Sábado'] && !this.days['Domingo'];
    this.courseForm.get('daysOfClasses')?.setValue(selected.length ? selected.join(', ') : '');
  }

  onLunVieChange(): void {
    const v = this.lunVie;
    ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'].forEach(d => this.days[d] = v);
    this.onDayChange();
  }

  public typesModality = ['Presencial', 'Remoto', 'Hibrido'];
  public typeCourse    = ['Regular', 'Extensión'];
}
