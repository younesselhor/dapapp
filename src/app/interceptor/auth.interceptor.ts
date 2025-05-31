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
// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import {
//   HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { isPlatformBrowser } from '@angular/common';
// import { AuthService } from '../services/auth.service';
// import { Router } from '@angular/router';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

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

//     return next.handle(authReq).pipe(
//       catchError((error: HttpErrorResponse) => {
//         // Ignore if already trying to refresh
//         const isRefreshEndpoint = req.url.includes('/refresh');

//         if (error.status === 401 && !isRefreshEndpoint) {
//           return this.authService.refreshToken().pipe(
//             switchMap(response => {
//               console.log('refresh token',response);
//               this.authService.saveToken(response.token); // Save new access token
//               const retryReq = req.clone({
//                 setHeaders: {
//                   Authorization: `Bearer ${response.token}`,
//                 },
//               });
//               return next.handle(retryReq);
//             }),
//             catchError(refreshError => {
//               // Refresh also failed: logout and redirect to login
//               this.authService.logoutAndClearData();
//               this.router.navigate(['/login']);
//               return throwError(() => refreshError);
//             })
//           );
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
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding auth headers for translation files and other assets
    if (this.shouldSkipAuth(req)) {
      return next.handle(req);
    }

    let authReq = req;

    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      console.log('Token from storage:', token ? 'Token exists' : 'No token found');
      
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Added Authorization header to request:', authReq.url);
      } else {
        console.log('No token available for request:', req.url);
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('HTTP Error:', error.status, error.message, 'URL:', req.url);
        
        // Don't handle auth errors for refresh endpoint or non-browser platforms
        if (!isPlatformBrowser(this.platformId) || this.isRefreshEndpoint(req)) {
          return throwError(() => error);
        }

        if (error.status === 401) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private shouldSkipAuth(req: HttpRequest<any>): boolean {
    // Skip auth for translation files, assets, and public endpoints
    const skipUrls = [
      '/assets/',
      '/i18n/',
      '/login',
      '/register',
      '/refresh'
    ];
    
    return skipUrls.some(url => req.url.includes(url));
  }

  private isRefreshEndpoint(req: HttpRequest<any>): boolean {
    return req.url.includes('/refresh') || req.url.includes('/token/refresh');
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      console.log('Attempting to refresh token...');
      
      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          console.log('Token refresh successful:', response);
          this.isRefreshing = false;
          
          // Handle different response structures
          const newToken = response.token || response.access_token || response.accessToken;
          
          if (newToken) {
            this.authService.saveToken(newToken);
            this.refreshTokenSubject.next(newToken);
            
            // Retry the original request with new token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            
            console.log('Retrying original request with new token');
            return next.handle(retryReq);
          } else {
            console.error('No token in refresh response:', response);
            throw new Error('Invalid refresh response');
          }
        }),
        catchError((refreshError) => {
          console.error('Token refresh failed:', refreshError);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          
          // Clear auth data and redirect to login
          this.authService.logoutAndClearData();
          this.router.navigate(['/login']);
          
          return throwError(() => refreshError);
        })
      );
    } else {
      // If already refreshing, wait for the new token
      console.log('Already refreshing token, waiting...');
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(retryReq);
        })
      );
    }
  }
}
