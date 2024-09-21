import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';  // Import your AuthService
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

// Create the interceptor as a function
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);  // Inject AuthService
  const token = authService.getToken();  // Get the token from AuthService

  if (token) {
    // Clone the request and add the Authorization header
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  } else {
    // Proceed without modifying if no token
    return next(req);
  }
};






// @Injectable()






// export class AuthInterceptor implements HttpInterceptor {
  
//   constructor(private authService: AuthService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.authService.getToken(); // Get the token from AuthService

//     if (token) {
//       // Clone the request and add the Authorization header
//       const cloned = req.clone({
//         headers: req.headers.set('Authorization', `Bearer ${token}`)
//       });

//       return next.handle(cloned);
//     } else {
//       return next.handle(req); // Proceed without modifying if no token
//     }
//   }
// }
