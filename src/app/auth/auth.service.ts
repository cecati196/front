import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  email:             string;
  displayName:       string;
  schoolId:          string | null;
  schoolDisplayName: string;
  role:              string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private userSubject = new BehaviorSubject<AuthUser | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Paso 1: redirigir a Entra ID con PKCE ─────────────────────────────

  async login(): Promise<void> {
    const verifier  = this.generateVerifier();
    const challenge = await this.generateChallenge(verifier);
    const redirectUri = `${window.location.origin}/auth/callback`;

    sessionStorage.setItem('pkce_verifier', verifier);

    const params = new URLSearchParams({
      client_id:             environment.entraClientId,
      response_type:         'code',
      redirect_uri:          redirectUri,
      scope:                 'openid profile email',
      response_mode:         'query',
      code_challenge:        challenge,
      code_challenge_method: 'S256',
    });

    window.location.href =
      `https://login.microsoftonline.com/${environment.entraTenantId}/oauth2/v2.0/authorize?${params}`;
  }

  // ── Paso 2: manejar el callback de Entra ID ───────────────────────────

  async handleCallback(): Promise<void> {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const error  = params.get('error');

    if (error) {
      console.error('Entra ID error:', params.get('error_description'));
      this.router.navigate(['/login']);
      return;
    }

    if (!code) return;

    const redirectUri  = `${window.location.origin}/auth/callback`;
    const codeVerifier = sessionStorage.getItem('pkce_verifier') ?? '';
    sessionStorage.removeItem('pkce_verifier');

    // 1. Intercambiar code por id_token directamente con Entra ID (PKCE, sin secret)
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${environment.entraTenantId}/oauth2/v2.0/token`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id:     environment.entraClientId,
          grant_type:    'authorization_code',
          code,
          redirect_uri:  redirectUri,
          code_verifier: codeVerifier,
          scope:         'openid profile email',
        }),
      }
    );

    if (!tokenRes.ok) {
      console.error('Error al intercambiar code con Entra ID');
      this.router.navigate(['/login']);
      return;
    }

    const { id_token: idToken } = await tokenRes.json();

    // 2. Enviar id_token al auth-microservice y obtener JWT propio
    const result = await this.http
      .post<{ token: string; user: AuthUser }>(
        `${environment.authServiceUrl}/auth/login`,
        { idToken }
      )
      .toPromise();

    if (result) {
      this.token = result.token;
      this.userSubject.next(result.user);
    }

    window.history.replaceState({}, '', '/');
    this.router.navigate(['/control-escolar']);
  }

  // ── Estado de sesión ──────────────────────────────────────────────────

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

  // ── PKCE helpers ──────────────────────────────────────────────────────

  private generateVerifier(): string {
    const arr = new Uint8Array(96);
    crypto.getRandomValues(arr);
    return this.base64url(arr.buffer);
  }

  private async generateChallenge(verifier: string): Promise<string> {
    const data   = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64url(digest);
  }

  private base64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let bin = '';
    bytes.forEach(b => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
