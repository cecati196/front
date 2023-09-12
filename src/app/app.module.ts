import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ContainerCoursesComponent } from './views/container-courses/container-courses.component';
import { HomeComponent } from './views/home/home.component';
import { CardQuestionsComponent } from './views/card-questions/card-questions.component';
import { GaleryComponent } from './views/galery/galery.component';
import { MenuComponent } from './shared/menu/menu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    ContainerCoursesComponent,
    HomeComponent,
    CardQuestionsComponent,
    GaleryComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
