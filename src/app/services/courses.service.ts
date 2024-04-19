import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Course } from '../shared/interfaces/course.interface';

const baseURL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  public url = `${baseURL}`;

  constructor(
    private http: HttpClient
  ) { }
  
  getCourses(){
    return this.http.get<any>(this.url);
  }

  newCourse(data: Course){
    return this.http.post<Course>(this.url, data);
  }
}