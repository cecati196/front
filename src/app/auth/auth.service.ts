import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  username:   string;
  name:       string;
  role:       string;
  schoolId:   string | null;
  schoolName: string;
}

interface LoginResponse {
  token: string;
  user:  AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private userSubject = new BehaviorSubject<AuthUser | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  async login(username: string, password: string): Promise<void> {
    const result = await firstValueFrom(
      this.http.post<LoginResponse>(
        `${environment.authServiceUrl}/api/auth/login`,
        { username, password },
      ),
    );
    this.token = result.token;
    this.userSubject.next(result.user);
    this.router.navigate(['/control-escolar']);
  }

  isAuthenticated(): boolean {
    if (!this.token) return false;
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  logout(): void {
    this.token = null;
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
