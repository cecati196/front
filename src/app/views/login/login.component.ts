import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector:    'app-login',
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  loading  = false;
  errorMsg: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading  = true;
    this.errorMsg = null;
    try {
      const { username, password } = this.form.value as { username: string; password: string };
      await this.auth.login(username, password);
    } catch (err: unknown) {
      const e = err as { status?: number };
      this.errorMsg = e?.status === 401
        ? 'Usuario o contraseña incorrectos'
        : 'Error de conexión. Intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }
}
