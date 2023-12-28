import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PROFESOR, SPECIALTIES } from 'src/app/shared/SPECIALTIES';

@Component({
  selector: 'app-new-course-form',
  templateUrl: './new-course-form.component.html',
  styleUrls: ['./new-course-form.component.css']
})
export class NewCourseFormComponent {
  @Output() closeNewCourseForm: EventEmitter<boolean> = new EventEmitter;
  public courseForm: FormGroup;
  public course = {};
  
  public phrases: string[] = [];
  public listSpecialties: string[] = [];
  public listProfesor = PROFESOR;
  public phareInput: string = '';

  constructor(
    private formBuilder: FormBuilder
  ){
    this.buildSpecialties();
    this.courseForm = this.formBuilder.group({
      specialitie: ['', Validators.required],
      nameCourse: ['', Validators.required],
      typeCourse: ['', Validators.required],
      profesor: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      modality: ['', Validators.required],
      daysOfClass: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      totalHours: ['', Validators.required],
      cost: ['', Validators.required],
      objective: [''],
      thematicContent: [''],
      observations: [''],
      pharse: [''],
    })
  }

  buildSpecialties(){
    for (let [key, value] of Object.entries(SPECIALTIES)) {      
      this.listSpecialties.push(value);
    }
  }
  
  cancelAddCourse(){
    console.log("ENTRA!!!");    
    this.closeNewCourseForm.emit(false)
  }

  addNewCourse(){
    if (this.courseForm.status === 'VALID') {
      console.log(this.courseForm.value)
    } else {
      console.log("completa los campos obligatorios");
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
