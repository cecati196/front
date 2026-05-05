import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { CardQuestionsComponent } from './views/card-questions/card-questions.component';
import { GaleryComponent } from './views/galery/galery.component';
import { ContainerCoursesComponent } from './views/container-courses/container-courses.component';
import { NotFoundPagesComponent } from './views/not-found-pages/not-found-pages.component';
import { SchoolControlComponent } from './views/school-control/school-control.component';
import { LoginComponent } from './views/login/login.component';
import { UserManagementComponent } from './views/user-management/user-management.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { UpdatePasswordComponent } from './views/update-password/update-password.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  { path: 'inicio',          component: HomeComponent },
  { path: 'preguntas',       component: CardQuestionsComponent },
  { path: 'cursos',          component: ContainerCoursesComponent },
  { path: 'galeria',         component: GaleryComponent },
  { path: 'login',             component: LoginComponent },
  { path: 'cambiar-contrasena', component: ChangePasswordComponent },
  { path: 'actualizar-contrasena', component: UpdatePasswordComponent, canActivate: [AuthGuard] },
  {
    path:        'control-escolar',
    component:   SchoolControlComponent,
    canActivate: [AuthGuard],
  },
  {
    path:        'admin-usuarios',
    component:   UserManagementComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  { path: '',   redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', component: NotFoundPagesComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
