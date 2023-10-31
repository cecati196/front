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
  public phraseSearch = '';

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe( (res) => {
      const { data } = res;
      for (const course of data) {
        this.allCourses.push(course);
      }
      this.createSpecialities(this.allCourses);
      this.loadAllCourses();
      this.spinner = !this.spinner;
    })
  }

  loadAllCourses(){
    this.filteredCourses = [...this.allCourses];
    this.countCourses =  this.allCourses.length;
  }

  private assignImage(course:Course) {
    for (let i = 0; i < CONSTANTS.logos.length; i++) {
      if (CONSTANTS.logos[i].name === course.specialty) {
        course.image = CONSTANTS.logos[i].url;
        break;
      } else  {
        course.image = "https://storage.googleapis.com/images-cecati196/assets/logoDefault.png";
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
  }

  filterResults(searchPhrase: string) {
    this.filteredCourses = this.allCourses.filter(course => 
      course.courseName.toLowerCase().includes(searchPhrase.toLowerCase())
      || course.professor.toLowerCase().includes(searchPhrase.toLowerCase())
      || course.specialty.toLowerCase().includes(searchPhrase.toLowerCase()) );
    this.phraseSearch = searchPhrase;
    this.countCourses = this.filteredCourses.length;
    this.showFilteredResults = true;
  }

  cleanResults(value:boolean){
    if (!value) {
      this.loadAllCourses();
      this.showFilteredResults = value;      
    }
  }
}
