import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AuthUser } from '../interfaces/user-interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginModalComponent implements OnDestroy {
  @Output() close = new EventEmitter<void>();

  loginForm: FormGroup;
  otpForm: FormGroup;
  showOTPModal = false;
  loginError = false;
  phoneNumber: string = '';
  tokenExist: string = '';
  otpExpired = false;
  otpResendEnabled = false;
  countdownInterval: any;
  resendCountdown = 30;
  userLogin = '';
  otpError = false;
  
  // Store user info when OTP is required
  pendingUserInfo: any = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cookieService: CookieService,
    private router: Router,
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

    const login = this.loginForm.value;
    this.userLogin = login.login;

    this.auth.login(login).subscribe({
      next: (response) => {
        this.loginError = false;
        
        // Check if OTP is required
        if (response.requiresOTP) {
          // Store pending user info but don't save token or set logged in yet
          this.pendingUserInfo = response;
          this.phoneNumber = this.extractPhoneNumber(login.login);
          this.showOTPModal = true;
          this.startOTPCountdown();
        } else {
          // Normal login without OTP
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
    
    const otpValue = this.otpForm.value.digit1 + this.otpForm.value.digit2 + 
                     this.otpForm.value.digit3 + this.otpForm.value.digit4;
    
    const otpPayload = {
      login: this.loginForm.value.login,
      otp: otpValue
    };

    console.log('Verifying OTP:', otpPayload); // Debug log

    this.auth.otplogin(otpPayload).subscribe({
      next: (response) => {
        console.log('OTP Response:', response); // Debug log
        this.otpError = false;
        
        if (response.token) {
          this.handleSuccessfulLogin(response.token, response.user);
          this.showOTPModal = false;
          this.closeModal();
        }
      },
      error: (err) => {
        console.error('OTP verification error:', err);
        this.otpError = true;
      }
    });
  }

  handleSuccessfulLogin(token: string, user?: AuthUser) {
    // Save token
    this.cookieService.set('token', token, {
      secure: false,
      sameSite: 'Strict',
      path: '/',
      expires: 7
    });

    // Save token in auth service
    this.auth.saveToken(token);
    
    // Set logged in status
    this.auth.setLoggedIn(true);
    
    // Fetch user profile if method exists
    if (this.auth.fetchUserProfile) {
      this.auth.fetchUserProfile();
    }
    
    // Navigate to home
    this.router.navigate(['/home']);
  }

  closeModal() {
    this.close.emit();
  }

  closeOTPModal() {
    this.showOTPModal = false;
    this.pendingUserInfo = null;
    this.otpError = false;
    this.clearOTPForm();
    this.clearCountdown();
  }

  clearOTPForm() {
    this.otpForm.reset();
  }

  clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startOTPCountdown() {
    this.otpResendEnabled = false;
    this.resendCountdown = 30;
    
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.otpResendEnabled = true;
        this.otpExpired = true;
        this.clearCountdown();
      }
    }, 1000);
  }

  resendOTP() {
    if (!this.otpResendEnabled) return;
    
    // Reset states
    this.otpExpired = false;
    this.otpError = false;
    this.clearOTPForm();
    
    // Restart countdown
    this.startOTPCountdown();
    
    // Call resend OTP API if available
    // this.auth.resendOTP({ login: this.loginForm.value.login }).subscribe(...);
  }

  extractPhoneNumber(login: string): string {
    // If login is a phone number, return it, otherwise return empty string
    return this.isValidPhoneNumber(login) ? login : '';
  }

  isValidPhoneNumber(phone: string): boolean {
    return /^\+?\d{10,15}$/.test(phone);
  }

    onOTPInputChange(event: any, nextField?: string) {
    if (event.target.value.length === 1 && nextField) {
      const nextInput = document.getElementById(nextField) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
  // onOTPInputChange(event: any, nextField?: string) {
  //   const input = event.target;
  //   const value = input.value;
    
  //   // Only allow numbers
  //   if (value && !/^[0-9]$/.test(value)) {
  //     input.value = '';
  //     return;
  //   }
    
  //   // Move to next field if value is entered
  //   if (value && nextField) {
  //     const nextInput = document.getElementById(nextField) as HTMLInputElement;
  //     if (nextInput) {
  //       nextInput.focus();
  //     }
  //   }
    
  //   // Move to previous field on backspace
  //   if (!value && event.inputType === 'deleteContentBackward') {
  //     const previousFields = ['digit1', 'digit2', 'digit3', 'digit4'];
  //     const currentIndex = previousFields.indexOf(input.id);
  //     if (currentIndex > 0) {
  //       const previousInput = document.getElementById(previousFields[currentIndex - 1]) as HTMLInputElement;
  //       if (previousInput) {
  //         previousInput.focus();
  //       }
  //     }
  //   }
  // }

  ngOnDestroy() {
    this.clearCountdown();
  }
}