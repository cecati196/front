import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/services/courses.service';
import { PROFESOR, SPECIALTIES } from 'src/app/shared/SPECIALTIES';
import { Course } from 'src/app/shared/interfaces/course.interface';

@Component({
  selector: 'app-new-course-form',
  templateUrl: './new-course-form.component.html',
  styleUrls: ['./new-course-form.component.css']
})
export class NewCourseFormComponent {
  @Output() closeNewCourseForm: EventEmitter<boolean> = new EventEmitter;
  public courseForm: FormGroup;
  public course:Course;
  
  public phrases: string[] = [];
  public listSpecialties: string[] = [];
  public listProfesor = PROFESOR;
  public phareInput: string = '';

  constructor( 
    private formBuilder: FormBuilder, 
    private coursesService: CoursesService
  ) {
    this.buildSpecialties();
    this.courseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      specialty: ['', Validators.required],
      thematicContent: [''],
      objective: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      daysOfClasses: ['', Validators.required],
      cost: ['', Validators.required],
      professor: ['', Validators.required],
      hours: ['', Validators.required],
      courseType: ['', Validators.required],
      courseModality: ['', Validators.required],
      searchPhrase: [''],
      observations: [''],
    });
    this.course = {
      courseName: '',
      specialty: '',
      thematicContent: '',
      objective: '',
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      daysOfClasses: '',
      cost: '',
      professor: '',
      hours: '',
      courseType: '',
      courseModality: '',
      searchPhrase: '',
      observations: ''
    }
  }

  buildSpecialties(){
    for (let [, value] of Object.entries(SPECIALTIES)) {
      this.listSpecialties.push(value);
    }
  }
  
  cancelAddCourse(){
    this.closeNewCourseForm.emit(false)
  }

  addNewCourse(){
    if (this.courseForm.status === 'VALID') {
      this.course = { ...this.courseForm.value };
      this.coursesService.newCourse(this.course).subscribe( (res:any)=>{
        console.log(res)
        alert(res.message);
      });
    } else {
      alert("Completa los campos obligatorios");
    }
  }
  
  newPhrase(eventPhrase:string){
    this.phrases.push(eventPhrase);
    this.phareInput = '';
  }  

  public daysOfClass = [
    'Lunes a Viernes',
    'Martes y Jueves',
    'Lunes, Miercoles y Viernes',
    'Sábados',
  ]

  public typesModality = [
    'Presencial',
    'Remoto',
    'Hibrido',
  ]

  public typeCourse = [
    'Regular',
    'Extensión',    
  ]

}
