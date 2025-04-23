// // import { Injectable } from '@angular/core';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthService {

// //   constructor() { }
// // }


// import { Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';
// import { LoginResponse, UserInterface } from '../interfaces/user-interface';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   currentUserSignal = signal<UserInterface | undefined | null>(undefined);
//   // private apiUrl = 'https://your-api.com/api/auth/login'; // 👈 update this

//   constructor(private http: HttpClient) {}

//   // login(credentials: { email: string; password: string }): Observable<UserInterface> {
//   //   return this.http.post<UserInterface>(this.apiUrl, credentials);
//   // }

//   login(identifier: string, password: string): Observable<boolean> {
//     return this.http.get<UserInterface[]>('/data/user.json').pipe(
//       map(users => {
//         const user = users.find(u => u.email === identifier && u.token === password);
//         return !!user;
//       })
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {  OtpLoginResponse, UserInterface } from '../interfaces/user-interface';
// import { User } from '../models/user.model';

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



  constructor(private http: HttpClient) {}

  // login(phoneOrEmail: string, password: string): Observable<any> {
  //   // Mock login API - replace with real API call
  //   if (phoneOrEmail === '+966.43994319' && password === 'password') {
  //     return of({ success: true }).pipe(
  //       delay(800),
  //       tap(() => {
  //         this.verificationPhoneNumber = phoneOrEmail;
  //         this.currentUserSubject.next({ phoneOrEmail });
  //       })
  //     );
  //   } else {
  //     return throwError(() => new Error('Incorrect email or password. Please try again.'));
  //   }
  // }
  login(login: UserInterface[] ): Observable<UserInterface> {
    return this.http.post<UserInterface>(this.baseUrl + 'login', login)
    // .pipe(
    //   tap((user) => {
    //     if (user.success) {
    //       this.verificationPhoneNumber = login.login;
    //       this.currentUserSubject.next({ phoneOrEmail: login.login });
    //     } else {
    //       throw new Error('Login failed');
    //     }
    //   })
    // );

  }

  register(registerUser : UserInterface[]): Observable<UserInterface>{
    return this.http.post<UserInterface>(this.baseUrl + 'register', registerUser);
  }
// otplogin(otp : OtpResponse[]): Observable<OtpResponse[]> {
// return this.http.post<OtpResponse[]>(this.baseUrl + 'verify-otp', otp);
// }
otplogin(otp :{login : string,otp:string}) :Observable<OtpLoginResponse> {
  return this.http.post<OtpLoginResponse>(this.baseUrl + 'verify-otp', otp);
  }
  sendVerificationCode(): Observable<any> {
    // Mock API to send verification code
    return of({ success: true }).pipe(delay(500));
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

  getVerificationPhoneNumber(): string {
    return this.verificationPhoneNumber;
  }

  setVerificationPhoneNumber(phone: string): void {
    this.verificationPhoneNumber = phone;
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }


}
