import { Component } from '@angular/core';
import { AuthService, AuthUser } from '../../auth/auth.service';

@Component({
  selector:    'app-school-control',
  templateUrl: './school-control.component.html',
  styleUrls:   ['./school-control.component.css'],
})
export class SchoolControlComponent {
  user: AuthUser | null = null;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(u => this.user = u);
  }

  logout(): void {
    this.auth.logout();
  }

  canManageUsers(): boolean {
    return this.auth.canManageUsers();
  }

  public isNewCourse    = false;
  public isEditCourse   = false;
  public isDeleteCourse = false;

  btnShowSelected(phrase: 'Add' | 'Edit' | 'Delete'): void {
    if (phrase === 'Add') {
      this.isNewCourse = true;
    } else if (phrase === 'Delete') {
      this.isEditCourse = true;
    } else {
      this.isDeleteCourse = true;
    }
  }

  closeNewCourseForm($event: boolean): void {
    this.isNewCourse = $event;
  }
}
