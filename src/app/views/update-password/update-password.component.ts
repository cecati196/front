import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const n = group.get('newPassword')?.value;
  const c = group.get('confirmPassword')?.value;
  return n && c && n !== c ? { passwordMismatch: true } : null;
}

@Component({
  selector:    'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls:   ['./update-password.component.css'],
})
export class UpdatePasswordComponent {
  form: FormGroup;
  loading  = false;
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

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading  = true;
    this.errorMsg = null;

    const { currentPassword, newPassword } = this.form.value as {
      currentPassword: string; newPassword: string;
    };

    this.auth.updatePassword(currentPassword, newPassword).catch((err) => {
      this.errorMsg = err?.error?.error ?? 'Error al actualizar la contraseña';
      this.loading  = false;
    });
  }

  cancel(): void {
    this.router.navigate(['/control-escolar']);
  }
}
