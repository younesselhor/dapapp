// // auth.interceptor.ts
// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// // import { AuthService } from './auth.service';
// import { catchError, Observable, throwError } from 'rxjs';
// import { isPlatformBrowser } from '@angular/common';
// import { AuthService } from '../services/auth.service';
// import { Router } from '@angular/router';
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService,private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let authReq = req;
//     if (isPlatformBrowser(this.platformId)) {
//       const token = this.authService.getToken();
//       if (token) {
//         authReq = req.clone({
//           setHeaders: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
//     }
//     // return next.handle(authReq);
//     return next.handle(authReq).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           // this.authService.logout().subscribe(); // Clear backend session
//           this.router.navigate(['/login']); // 👈 redirect to login page
//         }
//         return throwError(() => error);
//       })
//     );

//   }
// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Ignore if already trying to refresh
        const isRefreshEndpoint = req.url.includes('/refresh');

        if (error.status === 401 && !isRefreshEndpoint) {
          return this.authService.refreshToken().pipe(
            switchMap(response => {
              console.log('refresh token',response);
              this.authService.saveToken(response.token); // Save new access token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`,
                },
              });
              return next.handle(retryReq);
            }),
            catchError(refreshError => {
              // Refresh also failed: logout and redirect to login
              this.authService.logoutAndClearData();
              this.router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
