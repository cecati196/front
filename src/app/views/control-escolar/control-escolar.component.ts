import { Component } from '@angular/core';
import { AuthService, AuthUser } from '../../auth/auth.service';

@Component({
  selector: 'app-control-escolar',
  templateUrl: './control-escolar.component.html',
  styleUrls: ['./control-escolar.component.css']
})
export class ControlEscolarComponent {
  user: AuthUser | null = null;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(u => this.user = u);
  }

  logout(): void {
    this.auth.logout();
  }
  public isNewCourse = false; 
  public isEditCourse = false; 
  public isDeleteCourse = false; 

  btnShowSelected(phrase:'Add' | 'Edit' |'Delete'){
    if (phrase === 'Add') {
      this.isNewCourse = true;
    } else if (phrase === 'Delete') {
      this.isEditCourse = true;
    } else {
      this.isDeleteCourse = true;
    }
  }

  closeNewCourseForm($event: boolean){
    this.isNewCourse = $event;
  }

}
