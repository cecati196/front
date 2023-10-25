import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { ContainerSpecialitiesComponent } from './views/container-specialities/container-specialities.component';
import { SearchComponent } from './components/search/search.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

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
    MenuComponent,
    ContainerSpecialitiesComponent,
    SearchComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
