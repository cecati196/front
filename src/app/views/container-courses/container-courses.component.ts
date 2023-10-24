import { Component, OnInit } from '@angular/core';

import { CoursesService } from '../../services/courses.service';
import { Course } from 'src/app/shared/interfaces/course.interface';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-container-courses',
  templateUrl: './container-courses.component.html',
  styleUrls: ['./container-courses.component.css']
})
export class ContainerCoursesComponent implements OnInit {
  constructor(
    private coursesService: CoursesService
    ){}
    
  public spinner = true;
  public showMoreContent: { [key:number]:boolean } = {};
  public allCourses:Course[] = [];
  public filteredCourses: Course[] = [];
  public showFilteredResults = false;
  public countCourses: number = 0;

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe( (res) => {
      const { data } = res;
      for (const course of data) {
        this.allCourses.push(course);
      }
      const specialities = this.createSpecialities(this.allCourses);
      this.filteredCourses = [...this.allCourses];
      this.countCourses =  this.allCourses.length;
      this.spinner = !this.spinner;
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
  
  moreInformation(index:number) {
    this.showMoreContent[index] =  !this.showMoreContent[index];
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
      return courseForSpeciality;
      // console.log(course)
      // const nameSpeciality = Object.keys(course);
      // console.log(nameSpeciality)
      // if (!array[0]) {
      //   console.log("entrando")
      //   }
      })
      console.log("especialidades", specialities)
      // if (specialities[0]) {
        
      // }
  return specialities;
    
    // if (image == undefined) {                
    //     image = "LogoCecatiEspecialidades.png";
    // }                 
  }

  filterResults(searchPhrase: string) {
    this.filteredCourses = this.allCourses.filter(course =>
      course.courseName.toLowerCase().includes(searchPhrase.toLowerCase())
      || course.professor.toLowerCase().includes(searchPhrase.toLowerCase()) 
      || course.specialty.toLowerCase().includes(searchPhrase.toLowerCase())
    );
    this.countCourses = this.filteredCourses.length;
    this.showFilteredResults = true;
  }
}
