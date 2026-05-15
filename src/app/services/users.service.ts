import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserDTO {
  id:                 number;
  username:           string;
  name:               string;
  role:               string;
  mustChangePassword: boolean;
  createdAt:          string;
}

export interface CreateUserDTO {
  username: string;
  name:     string;
  role:     string;
}

export interface CreateUserResponse extends UserDTO {
  tempPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private url = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.url);
  }

  create(data: CreateUserDTO): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.url, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
