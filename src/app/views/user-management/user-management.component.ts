import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService, UserDTO, CreateUserResponse } from '../../services/users.service';

@Component({
  selector:    'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls:   ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users:       UserDTO[] = [];
  showForm     = false;
  loading      = false;
  errorMsg:    string | null = null;
  newUserTemp: { username: string; tempPassword: string } | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.form = this.fb.group({
      username:   ['', Validators.required],
      name:       ['', Validators.required],
      role:       ['', Validators.required],
      schoolId:   [''],
      schoolName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
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

    const { username, name, role, schoolId, schoolName } = this.form.value as {
      username: string; name: string; role: string; schoolId: string; schoolName: string;
    };

    this.usersService.create({ username, name, role, schoolId: schoolId || undefined, schoolName })
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

  onDelete(user: UserDTO): void {
    if (!confirm(`¿Eliminar al usuario "${user.username}"?`)) return;
    this.usersService.delete(user.id).subscribe({
      next:  () => (this.users = this.users.filter((u) => u.id !== user.id)),
      error: () => alert('Error al eliminar usuario'),
    });
  }
}
