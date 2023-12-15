import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { CardQuestionsComponent } from './views/card-questions/card-questions.component';
import { GaleryComponent } from './views/galery/galery.component';
import { ContainerCoursesComponent } from './views/container-courses/container-courses.component';
import { NotFoundPagesComponent } from './views/not-found-pages/not-found-pages.component';
import { ControlEscolarComponent } from './views/control-escolar/control-escolar.component';

const routes: Routes = [
  { path: 'inicio', component : HomeComponent },
  { path: 'preguntas', component: CardQuestionsComponent },
  { path: 'cursos', component: ContainerCoursesComponent },
  { path: 'galeria', component: GaleryComponent},
  { path: 'control-escolar', component: ControlEscolarComponent},
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: '**', component: NotFoundPagesComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
