import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  let authReq = req;

  // Only add token in browser environment
  if (isPlatformBrowser(platformId)) {
    const token = authService.getToken();
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if this is a refresh endpoint or login/register endpoint
      const isRefreshEndpoint = req.url.includes('/refresh');
      const isLoginEndpoint = req.url.includes('/login') || 
                              req.url.includes('/register') || 
                              req.url.includes('/verify-otp');
      
      // Only try to refresh token if:
      // 1. We're in the browser
      // 2. We get a 401 error
      // 3. This is not already a refresh request
      // 4. This is not a login/register request
      // 5. User is currently logged in (has a token)
      if (isPlatformBrowser(platformId) && 
          error.status === 401 && 
          !isRefreshEndpoint && 
          !isLoginEndpoint && 
          authService.getToken()) {
        
        return authService.refreshToken().pipe(
          switchMap(response => {
            authService.saveToken(response.token);
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`
              }
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
            // Refresh also failed: logout and redirect to login
            authService.logoutAndClearData();
            authService.triggerLoginModal();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};