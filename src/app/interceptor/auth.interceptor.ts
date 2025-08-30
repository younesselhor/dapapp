
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
        // Check if this is a refresh endpoint or login/register endpoint
        const isRefreshEndpoint = req.url.includes('/refresh');
        const isLoginEndpoint = req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/verify-otp');
        
        // Only try to refresh token if:
        // 1. We get a 401 error
        // 2. This is not already a refresh request
        // 3. This is not a login/register request
        // 4. User is currently logged in (has a token)
        if (error.status === 401 && !isRefreshEndpoint && !isLoginEndpoint && this.authService.getToken()) {
          return this.authService.refreshToken().pipe(
            switchMap(response => {
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
              this.authService.triggerLoginModal();
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
