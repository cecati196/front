import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { NotFoundPagesComponent } from './views/not-found-pages/not-found-pages.component';
import { SchoolControlComponent } from './views/school-control/school-control.component';
import { LoginComponent } from './views/login/login.component';
import { AuthCallbackComponent } from './views/auth-callback/auth-callback.component';
import { UserManagementComponent } from './views/user-management/user-management.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { NewCourseFormComponent } from './views/new-course-form/new-course-form.component';
import { EditCourseFormComponent } from './views/edit-course-form/edit-course-form.component';
import { DeleteCourseComponent } from './views/delete-course/delete-course.component';
import { CatalogManagerComponent } from './views/catalog-manager/catalog-manager.component';
import { UpdatePasswordComponent } from './views/update-password/update-password.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { WakeUpIndicatorComponent } from './core/wake-up-indicator.component';
import { WakeUpService } from './core/wake-up.service';
import { RetryInterceptor } from './core/retry.interceptor';
import { AuthInterceptor } from './auth/auth.interceptor';

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
    SpinnerComponent,
    NotFoundPagesComponent,
    SchoolControlComponent,
    LoginComponent,
    AuthCallbackComponent,
    UserManagementComponent,
    ChangePasswordComponent,
    NewCourseFormComponent,
    EditCourseFormComponent,
    DeleteCourseComponent,
    UpdatePasswordComponent,
    CatalogManagerComponent,
    DialogComponent,
    WakeUpIndicatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:    true,
    },
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: RetryInterceptor,
      multi:    true,
    },
    {
      provide:    APP_INITIALIZER,
      useFactory: (wake: WakeUpService) => () => wake.warmUp(),
      deps:       [WakeUpService],
      multi:      true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
