import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/services/courses.service';
import { PROFESOR, SPECIALTIES } from 'src/app/shared/SPECIALTIES';
import { Course } from 'src/app/shared/interfaces/course.interface';

@Component({
  selector: 'app-edit-course-form',
  templateUrl: './edit-course-form.component.html',
  styleUrls: ['./edit-course-form.component.css'],
})
export class EditCourseFormComponent implements OnInit {
  @Output() closeEditCourseForm = new EventEmitter<boolean>();

  step: 'select' | 'edit' = 'select';

  allCourses:      Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse:  Course | null = null;
  searchText = '';

  loading   = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  courseForm: FormGroup;

  listSpecialties: string[] = [];
  listProfesor = PROFESOR;

  daysOfClass = [
    'Lunes a Viernes',
    'Lunes, Miercoles y Viernes',
    'Martes y Jueves',
    'Sábados',
  ];
  typesModality = ['Presencial', 'Remoto', 'Híbrido'];
  typeCourse    = ['Regular', 'Extensión'];

  constructor(private fb: FormBuilder, private coursesService: CoursesService) {
    for (const value of Object.values(SPECIALTIES)) {
      this.listSpecialties.push(value);
    }

    this.courseForm = this.fb.group({
      courseName:     ['', Validators.required],
      specialty:      ['', Validators.required],
      thematicContent: [''],
      objective:      [''],
      startTime:      ['', Validators.required],
      endTime:        ['', Validators.required],
      startDate:      ['', Validators.required],
      endDate:        ['', Validators.required],
      daysOfClasses:  ['', Validators.required],
      cost:           ['', Validators.required],
      professor:      ['', Validators.required],
      hours:          ['', Validators.required],
      courseType:     ['', Validators.required],
      courseModality: ['Presencial', Validators.required],
      searchPhrase:   [''],
      observations:   [''],
    });
  }

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.allCourses      = courses;
        this.filteredCourses = courses;
      },
      error: () => (this.errorMsg = 'Error al cargar los cursos'),
    });
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
      courseName:     course.courseName,
      specialty:      course.specialty,
      thematicContent: course.thematicContent ?? '',
      objective:      course.objective        ?? '',
      startTime:      course.startTime,
      endTime:        course.endTime,
      startDate:      course.startDate,
      endDate:        course.endDate,
      daysOfClasses:  course.daysOfClasses,
      cost:           course.cost,
      professor:      course.professor,
      hours:          course.hours,
      courseType:     course.courseType,
      courseModality: course.courseModality,
      searchPhrase:   course.searchPhrase ?? '',
      observations:   course.observations  ?? '',
    });
    this.step = 'edit';
  }

  backToList(): void {
    this.step         = 'select';
    this.selectedCourse = null;
    this.errorMsg     = null;
    this.successMsg   = null;
    this.courseForm.reset({ courseModality: 'Presencial' });
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

  cancel(): void {
    this.closeEditCourseForm.emit(false);
  }
}
