import { Component, OnInit } from '@angular/core';

import { CoursesService } from '../../services/courses.service';
import { Course } from 'src/app/shared/interfaces/course.interface';
import { Specialitie } from 'src/app/shared/interfaces/specialities';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-container-courses',
  templateUrl: './container-courses.component.html',
  styleUrls: ['./container-courses.component.css']
})
export class ContainerCoursesComponent implements OnInit{
  constructor(
    private coursesService: CoursesService
  ){}

  public courses:Course[] = [];
  public specialities:Specialitie = {
    foodAndDrinks: [],
  };

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe( (res) => {
      const { data } = res;
      for (const course of data) {
        this.courses.push(course);
      }
      const specialities = this.createSpecialities(this.courses);
    })
  }

  private assignImage(course:Course) {
    for (let i = 0; i < CONSTANTS.logos.length; i++) {
      if (CONSTANTS.logos[i].name === course.specialty) {
        course.image = CONSTANTS.logos[i].url;
        break;
      }
    }
    return course;
  }
  

  private createSpecialities(courses: Course[]){
    const specialitiesNames:string[] = [];
    for (const key in courses) {
      const objCourse = courses[key];
      if (!specialitiesNames.includes(objCourse.specialty)) {
        specialitiesNames.push(objCourse.specialty);
      }
      this.assignImage(objCourse);
    }
    const specialities = specialitiesNames.map( speciality => {
      const courseForSpeciality:Course[] = [];
      for (const key in courses) {
        const course = courses[key];
        if (speciality === course.specialty) {
          courseForSpeciality.push(course);
        }
      }
      console.log(courseForSpeciality);
      return courseForSpeciality;
      // console.log(course)
      // const nameSpeciality = Object.keys(course);
      // console.log(nameSpeciality)
      // if (!array[0]) {
      //   console.log("entrando")
      //   }
      })
      //console.log(specialities)
      if (specialities[0]) {
        
      }
  return specialities;
    
    // if (image == undefined) {                
    //     image = "LogoCecatiEspecialidades.png";
    // }                 
  }

}
