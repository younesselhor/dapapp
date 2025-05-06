
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import {  LoginRequest, MeResponse, OtpLoginResponse, RegistrationRequest, RegistrationResponse, UserInterface } from '../interfaces/user-interface';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { response } from 'express';

export interface IUserRegister{
  firstName: string
      lastName: string
      email: string
      phone: number
      password:string
      confirmPassword:string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private verificationPhoneNumber = '';
  // private loginUrl = 'http://127.0.0.1:8000/api/'; // 👈 update this
  // baseUrl = 'https://phpstack-1447596-5436406.cloudwaysapps.com/api/';
  baseUrl = 'https://be.dabapp.co/api/'; // 👈 update this

  private userProfileSubject = new BehaviorSubject<MeResponse | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();
  private profileLoaded = false;

  constructor(private http: HttpClient ,
     private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object) {}


  login(login: LoginRequest): Observable<UserInterface> {
    return this.http.post<UserInterface>(this.baseUrl + 'login', login)
    .pipe(
      tap((response: UserInterface)=>{
        if(response.token) {
          this.saveToken(response.token);
          this.currentUserSubject.next(response);
          this.setLoggedIn(true);
          this.fetchUserProfile();
        }

      })
    );

  }

  register(registerUser: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.baseUrl + 'register', registerUser).pipe(
      tap((response: RegistrationResponse) => {
        if(response.token) {
          this.saveToken(response.token);
          this.currentUserSubject.next(response);
          this.setLoggedIn(true);
          this.fetchUserProfile();
        }
      })
    )
  }

otplogin(otp :{login : string,otp:string}) :Observable<OtpLoginResponse> {
  return this.http.post<OtpLoginResponse>(this.baseUrl + 'verify-otp', otp);
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

  verifyCode(code: string): Observable<any> {
    // Mock verification API - replace with real API call
    if (code === '3066') {
      return of({ success: true }).pipe(
        delay(800),
        tap(() => {
          this.currentUserSubject.next({
            phoneOrEmail: this.verificationPhoneNumber,
            verified: true
          });
        })
      );
    } else {
      return throwError(() => new Error('Invalid verification code.'));
    }
  }
  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.set('token', token, {
        expires: 7,
        secure: true,
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
    if (!this.profileLoaded && this.hasToken()) {
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
            console.log(profile);
          }
        });
    }
  }

  private handleUnauthorized(): void {
    // Handle unauthorized scenarios (expired token, etc.)
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
  updateUser(data: any): Observable<any> {
    return this.http.put( this.baseUrl+ 'user/update', data);
  }

}
