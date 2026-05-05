import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  username: string;
  name:     string;
  role:     string;
}

interface LoginSuccess {
  token: string;
  user:  AuthUser;
}

interface PasswordChangeRequired {
  requiresPasswordChange: true;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private userSubject = new BehaviorSubject<AuthUser | null>(null);

  pendingPasswordChange: { username: string } | null = null;

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  async login(username: string, password: string): Promise<void> {
    const result = await firstValueFrom(
      this.http.post<LoginSuccess | PasswordChangeRequired>(
        `${environment.authServiceUrl}/api/auth/login`,
        { username, password },
      ),
    );

    if ('requiresPasswordChange' in result && result.requiresPasswordChange) {
      this.pendingPasswordChange = { username: result.username };
      this.router.navigate(['/cambiar-contrasena']);
      return;
    }

    const success = result as LoginSuccess;
    this.token = success.token;
    this.userSubject.next(success.user);
    this.router.navigate(['/control-escolar']);
  }

  async changePassword(username: string, currentPassword: string, newPassword: string): Promise<void> {
    const result = await firstValueFrom(
      this.http.post<LoginSuccess>(
        `${environment.authServiceUrl}/api/auth/change-password`,
        { username, currentPassword, newPassword },
      ),
    );
    this.token = result.token;
    this.userSubject.next(result.user);
    this.pendingPasswordChange = null;
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

  canManageUsers(): boolean {
    const user = this.userSubject.getValue();
    return user?.role === 'admin' || user?.role === 'Directivo';
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
