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

  getProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.base}/professors`);
  }
}
