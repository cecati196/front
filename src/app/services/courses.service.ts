import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Course } from '../shared/interfaces/course.interface';

interface ApiCourse {
  id:                 number;
  curso:              string;
  especialidad:       string | null;
  contenido_tematico: string | null;
  objetivo:           string | null;
  hora_inicio:        string | null;
  hora_fin:           string | null;
  fecha_inicio:       string | null;
  fecha_termino:      string | null;
  dias_de_clases:     string | null;
  costo:              number | null;
  profesor:           string | null;
  horas:              number | null;
  tipo_de_curso:      string | null;
  modalidad_curso:    string | null;
  frase_busqueda:     string | null;
  observaciones:      string | null;
}

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private url = `${environment.apiUrl}/api/courses`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<ApiCourse[]>(this.url).pipe(
      map(courses => courses.map(c => this.mapCourse(c)))
    );
  }

  newCourse(data: Course): Observable<Course> {
    return this.http.post<ApiCourse>(this.url, data).pipe(
      map(c => this.mapCourse(c))
    );
  }

  private mapCourse(raw: ApiCourse): Course {
    return {
      id:             raw.id,
      courseName:     raw.curso,
      specialty:      raw.especialidad ?? '',
      thematicContent: raw.contenido_tematico ?? undefined,
      objective:      raw.objetivo ?? undefined,
      startTime:      raw.hora_inicio ?? '',
      endTime:        raw.hora_fin ?? '',
      startDate:      raw.fecha_inicio  ? this.formatDate(raw.fecha_inicio)  : '',
      endDate:        raw.fecha_termino ? this.formatDate(raw.fecha_termino) : '',
      daysOfClasses:  raw.dias_de_clases ?? '',
      cost:           raw.costo != null ? String(raw.costo) : '0',
      professor:      raw.profesor ?? '',
      hours:          raw.horas   != null ? String(raw.horas) : '',
      courseType:     raw.tipo_de_curso   ?? '',
      courseModality: raw.modalidad_curso ?? '',
      searchPhrase:   raw.frase_busqueda  ?? '',
      observations:   raw.observaciones   ?? undefined,
    };
  }

  private formatDate(iso: string): string {
    const d     = new Date(iso);
    const day   = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year  = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
}
