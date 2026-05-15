import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService, UserDTO, CreateUserResponse } from '../../services/users.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { AuthService, AuthUser } from '../../auth/auth.service';

@Component({
  selector:    'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls:   ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  user:        AuthUser | null = null;
  users:       UserDTO[] = [];
  showForm     = false;
  showTableUsers = true;
  loading      = false;
  errorMsg:    string | null = null;
  newUserTemp: { username: string; tempPassword: string } | null = null;

  form: FormGroup;

  constructor(
    private fb:           FormBuilder,
    private usersService: UsersService,
    private dialog:       DialogService,
    private auth:         AuthService,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      name:     ['', Validators.required],
      role:     ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(u => this.user = u);
    this.loadUsers();
  }

  logout(): void {
    this.auth.logout();
  }

  loadUsers(): void {
    this.usersService.getAll().subscribe({
      next:  (data) => (this.users = data),
      error: () => (this.errorMsg = 'Error al cargar usuarios'),
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.form.reset();
      this.errorMsg = null;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading  = true;
    this.errorMsg = null;

    const { username, name, role } = this.form.value as {
      username: string; name: string; role: string;
    };

    this.usersService.create({ username, name, role })
      .subscribe({
        next: (res: CreateUserResponse) => {
          this.users.push(res);
          this.newUserTemp = { username: res.username, tempPassword: res.tempPassword };
          this.form.reset();
          this.showForm = false;
          this.loading  = false;
        },
        error: (err) => {
          this.errorMsg = err?.error?.error === 'El nombre de usuario ya existe'
            ? 'Ese nombre de usuario ya está en uso'
            : 'Error al crear usuario';
          this.loading = false;
        },
      });
  }

  clearTempPassword(): void {
    this.newUserTemp = null;
  }

  async onDelete(user: UserDTO): Promise<void> {
    const confirmed = await this.dialog.openConfirm(
      `¿Eliminar al usuario "${user.username}"?`,
      { confirmLabel: 'Eliminar', isDangerous: true },
    );
    if (!confirmed) return;
    this.usersService.delete(user.id).subscribe({
      next:  () => (this.users = this.users.filter((u) => u.id !== user.id)),
      error: (err) => {
        const msg = err?.error?.error ?? 'Error al eliminar usuario';
        this.dialog.openAlert(msg);
      },
    });
  }
}
