import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Specialty, Professor } from '../shared/interfaces/catalog.interface';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private base = `${environment.apiUrl}/api/catalogs`;

  constructor(private http: HttpClient) {}

  getSpecialties(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(`${this.base}/specialties`);
  }

  addSpecialty(name: string): Observable<Specialty> {
    return this.http.post<Specialty>(`${this.base}/specialties`, { name });
  }

  removeSpecialty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/specialties/${id}`);
  }

  getProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.base}/professors`);
  }

  addProfessor(name: string): Observable<Professor> {
    return this.http.post<Professor>(`${this.base}/professors`, { name });
  }

  removeProfessor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/professors/${id}`);
  }
}
