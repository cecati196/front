import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPwd     = group.get('newPassword')?.value;
  const confirmPwd = group.get('confirmPassword')?.value;
  return newPwd === confirmPwd ? null : { passwordMismatch: true };
}

@Component({
  selector:    'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls:   ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  form:     FormGroup;
  loading   = false;
  errorMsg: string | null = null;

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword:     ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatch },
    );
  }

  ngOnInit(): void {
    if (!this.auth.pendingPasswordChange) {
      this.router.navigate(['/login']);
    }
  }

  get username(): string {
    return this.auth.pendingPasswordChange?.username ?? '';
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading  = true;
    this.errorMsg = null;

    const { currentPassword, newPassword } = this.form.value as {
      currentPassword: string;
      newPassword: string;
    };

    try {
      await this.auth.changePassword(this.username, currentPassword, newPassword);
    } catch (err: unknown) {
      const e = err as { status?: number; error?: { error?: string } };
      if (e?.status === 400 && e?.error?.error?.includes('igual')) {
        this.errorMsg = 'La nueva contraseña no puede ser igual a la temporal';
      } else if (e?.status === 401) {
        this.errorMsg = 'La contraseña temporal es incorrecta';
      } else {
        this.errorMsg = 'Error al cambiar la contraseña. Intenta de nuevo.';
      }
    } finally {
      this.loading = false;
    }
  }
}
