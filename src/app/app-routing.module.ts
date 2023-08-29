import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { CardQuestionsComponent } from './views/card-questions/card-questions.component';
import { GaleryComponent } from './views/galery/galery.component';
import { ContainerCoursesComponent } from './views/container-courses/container-courses.component';

const routes: Routes = [
  { path: 'home', component : HomeComponent },
  { path: 'preguntas', component: CardQuestionsComponent },
  { path: 'cursos', component: ContainerCoursesComponent },
  { path: 'galeria', component: GaleryComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
