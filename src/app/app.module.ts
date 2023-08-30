import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CardCursosComponent } from './views/card-cursos/card-cursos.component';
import { ContainerCoursesComponent } from './views/container-courses/container-courses.component';
import { HomeComponent } from './views/home/home.component';
import { CardQuestionsComponent } from './views/card-questions/card-questions.component';
import { GaleryComponent } from './views/galery/galery.component';
import { MenuComponent } from './shared/menu/menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    CardCursosComponent,
    ContainerCoursesComponent,
    HomeComponent,
    CardQuestionsComponent,
    GaleryComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
