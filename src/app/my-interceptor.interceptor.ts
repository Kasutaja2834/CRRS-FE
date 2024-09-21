import { HttpInterceptorFn } from '@angular/common/http';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';



// export const myInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
//   console.log('Intercepted request:', req);
//   // Siin saab teha erinevaid muudatusi päringule või vastusele
//   return next.handle(req);

// };



// export const myInterceptor: HttpInterceptorFn = (req, next) => {
//   // Lisa vajalikud loogikad siin
//   console.log('Intercepting request:', req);
//   return next(req);
// };





// export function myInterceptor(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   // Näiteks logi kõik päringud
//   console.log('Intercepting request:', req);

//   // Muuda päringut või lisa päiseid
//   const clonedRequest = req.clone({
//     setHeaders: {
//       Authorization: 'Bearer your-token-here'
//     }
//   });

//   // Edasta päring edasi
//   return next.handle(clonedRequest);
//}
