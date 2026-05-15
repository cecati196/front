import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService, AuthUser } from '../../auth/auth.service';
import { SchoolControlStateService } from '../../core/school-control-state.service';

@Component({
  selector:    'app-school-control',
  templateUrl: './school-control.component.html',
  styleUrls:   ['./school-control.component.css'],
})
export class SchoolControlComponent implements OnInit, OnDestroy {
  user: AuthUser | null = null;

  public isNewCourse      = false;
  public isEditCourse     = false;
  public isCatalogManager = false;

  private subscriptions = new Subscription();

  constructor(
    private auth:               AuthService,
    private schoolControlState: SchoolControlStateService,
  ) {
    this.subscriptions.add(
      this.auth.user$.subscribe(u => this.user = u),
    );
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.schoolControlState.reset$.subscribe(() => this.resetSubviews()),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private resetSubviews(): void {
    this.isNewCourse      = false;
    this.isEditCourse     = false;
    this.isCatalogManager = false;
  }

  logout(): void {
    this.auth.logout();
  }

  canManageUsers(): boolean {
    return this.auth.canManageUsers();
  }

  btnShowSelected(phrase: 'Add' | 'Edit'): void {
    if (phrase === 'Add') {
      this.isNewCourse = true;
    } else {
      this.isEditCourse = true;
    }
  }

  closeNewCourseForm($event: boolean): void {
    this.isNewCourse = $event;
  }

  closeEditCourseForm($event: boolean): void {
    this.isEditCourse = $event;
  }

  openCatalogManager(): void {
    this.isCatalogManager = true;
  }

  onCloseCatalogManager(): void {
    this.isCatalogManager = false;
  }
}
