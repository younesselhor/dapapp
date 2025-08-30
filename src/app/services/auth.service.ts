// auth.service.ts - Updated version
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { LoginRequest, MeResponse, OtpLoginResponse, RegistrationRequest, RegistrationResponse, UserInterface } from '../interfaces/user-interface';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';

export interface IUserRegister {
  firstName: string
  lastName: string
  email: string
  phone: number
  password: string
  confirmPassword: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private verificationPhoneNumber = '';
  
  baseUrl = 'https://be.dabapp.co/api/';

  private userProfileSubject = new BehaviorSubject<MeResponse | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();
  private profileLoaded = false;
  private showLoginModalSubject = new Subject<void>();
  loginModal$ = this.showLoginModalSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  triggerLoginModal() {
    this.showLoginModalSubject.next();
  }

  login(login: LoginRequest): Observable<UserInterface> {
    return this.http.post<UserInterface>(this.baseUrl + 'login', login).pipe(
      tap((response: UserInterface) => {
        // Only set user data if OTP is not required
        if (!response.requiresOTP) {
          if (response.token) {
            this.saveToken(response.token);
            this.currentUserSubject.next(response);
            this.setLoggedIn(true);
            this.fetchUserProfile();
          }
        }
        // If OTP is required, don't save token or set logged in status yet
      })
    );
  }

  register(registerUser: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.baseUrl + 'register', registerUser).pipe(
      tap((response: RegistrationResponse) => {
        if (response.token) {
          this.saveToken(response.token);
          this.currentUserSubject.next(response);
          this.setLoggedIn(true);
          this.fetchUserProfile();
        }
      })
    )
  }

  refreshToken(): Observable<{ token: string }> {
    // Only attempt refresh if user is currently logged in
    if (!this.hasToken()) {
      return throwError(() => new Error('No token available'));
    }
    
    return this.http.post<{ token: string }>(this.baseUrl + 'refresh', {});
  }

  otplogin(otp: { login: string, otp: string }): Observable<OtpLoginResponse> {
    return this.http.post<OtpLoginResponse>(this.baseUrl + 'verify-otp', otp).pipe(
      tap((response: OtpLoginResponse) => {
        // After successful OTP verification, save token and set logged in
        if (response.token) {
          this.saveToken(response.token);
          this.currentUserSubject.next(response);
          this.setLoggedIn(true);
          // Don't call fetchUserProfile here - let the component handle it
        }
      })
    );
  }

  getProfile(): Observable<MeResponse> {
    return this.http.get<MeResponse>(this.baseUrl + 'me');
  }

  sendVerificationCode(): Observable<any> {
    return of({ success: true }).pipe(delay(500));
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.baseUrl + 'logout', {});
  }

  // verifyCode(code: string): Observable<any> {
  //   if (code === '3066') {
  //     return of({ success: true }).pipe(
  //       delay(800),
  //       tap(() => {
  //         this.currentUserSubject.next({
  //           phoneOrEmail: this.verificationPhoneNumber,
  //           verified: true
  //         });
  //       })
  //     );
  //   } else {
  //     return throwError(() => new Error('Invalid verification code.'));
  //   }
  // }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.set('token', token, {
        expires: 7,
        secure: false,
        sameSite: 'Lax'
      });
    }
  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.cookieService.get('token');
      return token || '';
    }
    return '';
  }

  getVerificationPhoneNumber(): string {
    return this.verificationPhoneNumber;
  }

  setVerificationPhoneNumber(phone: string): void {
    this.verificationPhoneNumber = phone;
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  private hasToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  fetchUserProfileOnce(): void {
    const token = this.getToken();
    if (token && !this.userProfileSubject.value) {
      this.getProfile().subscribe({
        next: (profile) => this.userProfileSubject.next(profile),
        error: (err) => console.error('Failed to fetch profile', err)
      });
    }
  }

  fetchUserProfile(): void {
    // Only fetch if we have a token and haven't loaded profile yet
    if (this.hasToken() && !this.profileLoaded) {
      this.http.get<MeResponse>(this.baseUrl + 'me')
        .pipe(
          catchError(error => {
            console.error('Failed to fetch profile', error);
            if (error.status === 401) {
              this.handleUnauthorized();
            }
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (profile) => {
            this.userProfileSubject.next(profile);
            this.profileLoaded = true;
          }
        });
    }
  }

  private handleUnauthorized(): void {
    this.clearUserData();
  }

  private clearUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.delete('token', '/');
      localStorage.clear();
      sessionStorage.clear();
    }
    this.currentUserSubject.next(null);
    this.userProfileSubject.next(null);
    this.profileLoaded = false;
    this.setLoggedIn(false);
  }

  public logoutAndClearData(): void {
    this.clearUserData();
  }

  updateUser(data: any): Observable<any> {
    return this.http.put(this.baseUrl + 'user/update', data);
  }

  // Firebase and Google Login
  // loginWithFirebaseToken(idToken: string): Observable<any> {
  //   return this.http.post(this.baseUrl + 'firebase-login', { idToken });
  // }

  // Email/Password Login
  // loginWithEmailPassword(login: string, password: string): Observable<UserInterface> {
  //   return this.http.post<UserInterface>(this.baseUrl + 'login', { login, password }).pipe(
  //     tap((response: UserInterface) => {
  //       // Only set user data if OTP is not required
  //       if (!response.requiresOTP) {
  //         if (response.token) {
  //           this.saveToken(response.token);
  //           this.currentUserSubject.next(response);
  //           this.setLoggedIn(true);
  //           this.fetchUserProfile();
  //         }
  //       }
  //     })
  //   );
  // }

  // Phone/Password Login - Returns user info and requiresFirebaseOTP flag
  // loginWithPhonePassword(phone: string, password: string): Observable<any> {
  //   return this.http.post(this.baseUrl + 'login-phone-password', { phone, password }).pipe(
  //     tap((response: any) => {
  //       console.log('Phone login response:', response);
  //       // Don't save token yet - wait for OTP verification
  //     })
  //   );
  // }

  // Verify OTP from backend
  // verifyOtp(userId: number, otp: string): Observable<any> {
  //   return this.http.post(this.baseUrl + 'verify-otp', { 
  //     user_id: userId, 
  //     otp: otp 
  //   }).pipe(
  //     tap((response: any) => {
  //       // Save token after successful verification
  //       if (response.token) {
  //         this.saveToken(response.token);
  //         this.currentUserSubject.next(response);
  //         this.setLoggedIn(true);
  //       }
  //     })
  //   );
  // }

  // Complete Firebase authentication
  // completeFirebaseAuth(userId: number, idToken: string): Observable<any> {
  //   return this.http.post(this.baseUrl + 'complete-firebase-auth', { 
  //     user_id: userId, 
  //     idToken: idToken 
  //   }).pipe(
  //     tap((response: any) => {
  //       console.log('Firebase auth completion response:', response);
  //       // Final token and user data
  //       if (response.token) {
  //         this.saveToken(response.token);
  //         this.currentUserSubject.next(response);
  //         this.setLoggedIn(true);
  //         this.fetchUserProfile();
  //       }
  //     })
  //   );
  // }

resendOTP(payload: { login: string}): Observable<any> {
  return this.http.post(this.baseUrl + 'resend-otp', payload);
}
  // Request OTP (if needed separately)
  requestOTP(login: string): Observable<any> {
    return this.http.post(this.baseUrl + 'request-otp', { login });
  }


  // Add these to your AuthService
forgotPassword(data: { login: string; method: string }) {
  return this.http.post(this.baseUrl + 'forgot-password', data);
}

resetPassword(data: { 
  login: string; 
  code: string; 
  password: string; 
  password_confirmation: string 
}) {
  return this.http.post(this.baseUrl + 'reset-password', data);
}


setUserProfile(profile: any) {
  this.userProfileSubject.next(profile);
}

getUserProfile() {
  return this.userProfileSubject.value;
}
}