import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

const baseURL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    private http: HttpClient
  ) { }
  
  getCourses(){
    const url = `${baseURL}`;
    return this.http.get<any>(url);
  }
}