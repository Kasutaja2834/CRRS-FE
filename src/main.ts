import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './app/auth/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
   // provideHttpClient(withInterceptorsFromDi())  // Siin kasutame withInterceptorsFromDi
    provideHttpClient(withInterceptors([AuthInterceptor]))  // Registreeri AuthInterceptor
  ]
})
  .catch(err => console.error(err));

