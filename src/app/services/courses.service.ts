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
    return this.http.post<ApiCourse>(this.url, this.toApiPayload(data)).pipe(
      map(c => this.mapCourse(c))
    );
  }

  updateCourse(id: number, data: Course): Observable<Course> {
    return this.http.put<ApiCourse>(`${this.url}/${id}`, this.toApiPayload(data)).pipe(
      map(c => this.mapCourse(c))
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  private mapCourse(raw: ApiCourse): Course {
    return {
      id:              raw.id,
      courseName:      raw.curso,
      specialty:       raw.especialidad       ?? '',
      thematicContent: raw.contenido_tematico ?? undefined,
      objective:       raw.objetivo           ?? undefined,
      startTime:       raw.hora_inicio        ?? '',
      endTime:         raw.hora_fin           ?? '',
      startDate:       raw.fecha_inicio  ? this.toInputDate(raw.fecha_inicio)  : '',
      endDate:         raw.fecha_termino ? this.toInputDate(raw.fecha_termino) : '',
      daysOfClasses:   raw.dias_de_clases     ?? '',
      cost:            raw.costo   != null ? String(raw.costo) : '0',
      professor:       raw.profesor           ?? '',
      hours:           raw.horas   != null ? String(raw.horas) : '',
      courseType:      raw.tipo_de_curso      ?? '',
      courseModality:  raw.modalidad_curso    ?? '',
      searchPhrase:    raw.frase_busqueda     ?? '',
      observations:    raw.observaciones      ?? undefined,
    };
  }

  private toApiPayload(data: Course): object {
    return {
      curso:              data.courseName,
      especialidad:       data.specialty       || null,
      contenido_tematico: data.thematicContent || null,
      objetivo:           data.objective       || null,
      hora_inicio:        data.startTime       || null,
      hora_fin:           data.endTime         || null,
      fecha_inicio:       data.startDate  ? `${data.startDate}T00:00:00.000Z` : null,
      fecha_termino:      data.endDate    ? `${data.endDate}T00:00:00.000Z`   : null,
      dias_de_clases:     data.daysOfClasses   || null,
      costo:              data.cost       ? Number(data.cost) : null,
      profesor:           data.professor       || null,
      horas:              data.hours      ? Number(data.hours) : null,
      tipo_de_curso:      data.courseType      || null,
      modalidad_curso:    data.courseModality  || null,
      frase_busqueda:     data.searchPhrase    || null,
      observaciones:      data.observations    || null,
    };
  }

  // Convierte ISO datetime a YYYY-MM-DD (formato de <input type="date">)
  private toInputDate(iso: string): string {
    return iso.slice(0, 10);
  }
}
