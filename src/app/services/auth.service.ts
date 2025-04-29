
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {  LoginRequest, MeResponse, OtpLoginResponse, RegistrationRequest, RegistrationResponse, UserInterface } from '../interfaces/user-interface';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';

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
  baseUrl = 'https://phpstack-1447596-5436406.cloudwaysapps.com/api/';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();
  router: any;

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
        }

      })
    );

  }

  register(registerUser: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.baseUrl + 'register', registerUser);
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

}
