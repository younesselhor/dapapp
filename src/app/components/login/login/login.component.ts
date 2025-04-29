// login.component.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../services/auth.service';
import { AuthUser, AuthUserDetails, MeResponse } from '../../../interfaces/user-interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    HttpClientModule
  ],
})
export class LoginComponent {

  loginForm!: FormGroup;
  loginError = false;
  showOTPModal = false;
  otpForm: FormGroup;
  phoneNumber :number = 0;
  userLogin = '';
  otpSent = false;
  otpExpired = false;
  otpResendEnabled = false;
  resendCountdown = 30;
  countdownInterval: any;
  currentOTP = '';
  tokenExist :string = '';

  currentUser: AuthUserDetails | undefined
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private auth : AuthService,
     private cookieService: CookieService,
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const login  = this.loginForm.value;
    this.userLogin = login.login;

    this.auth.login(login).subscribe({
      next: (response) => {
        this.loginError = false;
        const token = response.token;
        this.auth.saveToken(token);
        this.auth.setLoggedIn(true);
        const user = response;
        if (response.requiresOTP) {
          this.showOTPModal = true;
        } else {
          this.handleSuccessfulLogin(response.token, response.user);
        }
      },
      error: (err) => {
        this.loginError = true;
        console.error('Login error:', err);
      }
    });

  }


  verifyOTP() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
  const  otpPayload = {
      login : this.loginForm.value.login,
      otp : this.otpForm.value.digit1 + this.otpForm.value.digit2 + this.otpForm.value.digit3 + this.otpForm.value.digit4
    }

    this.auth.otplogin(otpPayload ).subscribe((response) =>{
      this.tokenExist = response.token

      if(this.tokenExist){
        this.handleSuccessfulLogin(response.token, response.user);

      }
    })
  }

  // shakeOTPForm() {
  //   const otpContainer = document.querySelector('.otp-container');
  //   if (otpContainer) {
  //     otpContainer.classList.add('animate-shake');
  //     setTimeout(() => {
  //       otpContainer.classList.remove('animate-shake');
  //     }, 500);
  //   }
  // }
  // handleSuccessfulLogin(token: string, user: any) {
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.showOTPModal = false;
  //   this.router.navigate(['/plates']);


  // }
  handleSuccessfulLogin(token: string, user?: AuthUser) {
    this.cookieService.set('token', token, {
      secure: true,
      sameSite: 'Strict',
      path: '/',
      expires: 7
    });

    // مباشرة نجيب profile
    this.auth.getProfile().subscribe({
      next: (res :MeResponse ) => {
        this.currentUser = res.user;
      }
    });
    this.auth.setLoggedIn(true);
    this.router.navigate(['/plates']);
  }

  isValidPhoneNumber(phone: string): boolean {
    // Simple phone number validation - adjust as needed
    return /^\+?\d{10,15}$/.test(phone);
  }



  // startResendCountdown() {
  //   this.resendCountdown = 30;
  //   this.otpResendEnabled = false;

  //   this.countdownInterval = setInterval(() => {
  //     this.resendCountdown--;
  //     if (this.resendCountdown <= 0) {
  //       clearInterval(this.countdownInterval);
  //       this.otpResendEnabled = true;
  //       this.otpExpired = true;
  //     }
  //   }, 1000);
  // }

  resendOTP() {
  //   if (this.otpResendEnabled) {

  //   }
  }

  onOTPInputChange(event: any, nextField?: string) {
    if (event.target.value.length === 1 && nextField) {
      const nextInput = document.getElementById(nextField) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }



  closeOTPModal() {
    this.showOTPModal = false;
    clearInterval(this.countdownInterval);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

}
