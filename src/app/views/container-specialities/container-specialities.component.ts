import { Component } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Course } from 'src/app/shared/interfaces/course.interface';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-container-specialities',
  templateUrl: './container-specialities.component.html',
  styleUrls: ['./container-specialities.component.css']
})
export class ContainerSpecialitiesComponent {
  public courses:Course[] = [];

  constructor(
    private coursesService: CoursesService
  ){}

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe( (res) => {
      const { data } = res;
      for (const course of data) {
        this.courses.push(course);
      }
      const specialities = this.createSpecialities(this.courses);
    })
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
  private assignImage(course:Course) {
    for (let i = 0; i < CONSTANTS.logos.length; i++) {
      if (CONSTANTS.logos[i].name === course.specialty) {
        course.image = CONSTANTS.logos[i].url;
        break;
      }
    }
    return course;
  }
}
