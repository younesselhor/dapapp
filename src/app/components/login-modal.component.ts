import { Component, EventEmitter, Output, OnDestroy, inject, OnInit, PLATFORM_ID, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthUser } from '../interfaces/user-interface';
import { Router, RouterLink } from '@angular/router';
// import { Auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';



@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginModalComponent implements OnDestroy, OnInit {
  // private authInstance = inject(Auth);
  @Output() close = new EventEmitter<void>();
  @Input() redirectUrl: string | null = null;

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
  // recaptchaVerifier: RecaptchaVerifier | null = null;
  confirmationResult: any = null;
  message: string = '';
  recaptchaWidgetId: any = null;
  isPhoneLoginFlow = false;
  recaptchaLoaded = false;
  pendingUserId: number | null = null;
  currentUser: any = null;
  showRecaptcha = false;

  isResendingOTP = false;


   // Store user info when OTP is required
  pendingUserInfo: any = null;


  showForgotPasswordModal = false;
forgotPasswordForm: FormGroup;
showResetPasswordModal = false;
resetPasswordForm: FormGroup;

showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cookieService: CookieService,
    private router: Router,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
    
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      // digit5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      // digit6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });

    this.forgotPasswordForm = this.fb.group({
  login: ['', [Validators.required]],
  method: ['whatsapp', [Validators.required]] // Default to whatsapp
});

this.resetPasswordForm = this.fb.group({
  code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  password_confirmation: ['', [Validators.required]]
}, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.onLoginInputChange();
    // this.loadRecaptcha();
  }

  
  // loadRecaptcha() {
  //   // Check if script already exists
  //   if (document.querySelector('script[src*="recaptcha"]')) {
  //     this.recaptchaLoaded = true;
  //     return;
  //   }

  //   const script = document.createElement('script');
  //   script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
  //   script.async = true;
  //   script.defer = true;
  //   script.onload = () => {
  //     this.recaptchaLoaded = true;
  //   };
  //   script.onerror = () => {
  //     console.error('Failed to load reCAPTCHA script');
  //     this.message = 'Failed to load verification system';
  //   };
  //   document.head.appendChild(script);
  // }

  // Format phone number to international format
  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with +, keep it
    if (phone.startsWith('+')) {
      return phone;
    }
    
    // If it starts with 00, replace with +
    if (cleaned.startsWith('00')) {
      return '+' + cleaned.substring(2);
    }
    
    // If it's a Moroccan number starting with 0, add +212
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '+212' + cleaned.substring(1);
    }
    
    // If it's already without country code and looks like Moroccan
    if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7'))) {
      return '+212' + cleaned;
    }
    
    // For other countries, assume user provides correct format
    if (!phone.startsWith('+')) {
      return '+' + cleaned;
    }
    
    return phone;
  }
  
onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  // Clear previous messages
  this.message = '';
  this.loginError = false;

  const login = this.loginForm.value;
  this.userLogin = login.login;

  this.auth.login(login).subscribe({
    next: (response) => {
      this.loginError = false;

      if (response.requiresOTP) {
        this.pendingUserInfo = response;
        this.phoneNumber = this.extractPhoneNumber(login.login);
        this.message = 'OTP sent successfully. Please check your phone.';
        this.showOTPModal = true;
        this.startOTPCountdown();
      } else {
        this.handleSuccessfulLogin(response.token, response.user);
      }
    },
    error: (err) => {
      this.loginError = true;
      // Set specific error message based on error type
      if (err.error?.message) {
        this.message = err.error.message;
      } else if (err.status === 401) {
        this.message = 'Invalid credentials. Please check your email/phone and password.';
      } else if (err.status === 422) {
        this.message = 'Please check your input and try again.';
      } else {
        this.message = 'Login failed. Please try again.';
      }
      console.error('Login error:', err);
    }
  });
}


  extractPhoneNumber(login: string): string {
    // If login is a phone number, return it, otherwise return empty string
    return this.isValidPhoneNumber(login) ? login : '';
  }

   isValidPhoneNumber(phone: string): boolean {
    return /^\+?\d{10,15}$/.test(phone);
  }

  

  getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format. Please use international format (+country code)';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/captcha-check-failed':
        return 'reCAPTCHA verification failed. Please try again.';
      case 'auth/invalid-verification-code':
        return 'Invalid OTP code. Please check and try again.';
      case 'auth/code-expired':
        return 'OTP code expired. Please request a new one.';
      case 'auth/quota-exceeded':
        return 'SMS quota exceeded. Please try again later.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }



  isSigningInWithGoogle = false;



passwordMatchValidator(form: FormGroup) {
  return form.get('password')?.value === form.get('password_confirmation')?.value 
    ? null 
    : { mismatch: true };
}

// Add these methods
openForgotPassword() {
  this.showForgotPasswordModal = true;
  this.loginError = false;
  this.message = '';
}

closeForgotPasswordModal() {
  this.showForgotPasswordModal = false;
  this.forgotPasswordForm.reset({ method: 'whatsapp' });
}

requestPasswordReset() {
  if (this.forgotPasswordForm.invalid) {
    this.forgotPasswordForm.markAllAsTouched();
    return;
  }

  const payload = this.forgotPasswordForm.value;
  this.auth.forgotPassword(payload).subscribe({
    next: (response) => {
      this.message = 'OTP code sent successfully to your WhatsApp';
      this.showForgotPasswordModal = false;
      this.showResetPasswordModal = true;
      this.startOTPCountdown();
    },
    error: (err) => {
      this.loginError = true;
      this.message = err.error?.message || 'Failed to send OTP. Please try again.';
      console.error('Forgot password error:', err);
    }
  });
}

resetPassword() {
  if (this.resetPasswordForm.invalid) {
    this.resetPasswordForm.markAllAsTouched();
    return;
  }

  const payload = {
    login: this.forgotPasswordForm.value.login,
    code: this.resetPasswordForm.value.code,
    password: this.resetPasswordForm.value.password,
    password_confirmation: this.resetPasswordForm.value.password_confirmation
  };

  this.auth.resetPassword(payload).subscribe({
    next: (response) => {
      this.message = 'Password reset successfully. You can now login with your new password.';
      this.showResetPasswordModal = false;
      this.resetPasswordForm.reset();
      this.forgotPasswordForm.reset({ method: 'whatsapp' });
    },
    error: (err) => {
      this.loginError = true;
      this.message = err.error?.message || 'Failed to reset password. Please try again.';
      console.error('Reset password error:', err);
    }
  });
}

closeResetPasswordModal() {
  this.showResetPasswordModal = false;
  this.resetPasswordForm.reset();
}


  isEmail(value: string): boolean {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
isPhone(value: string): boolean {
  if (!value) return false;
  // More flexible phone regex for international numbers
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
  return phoneRegex.test(value);
}


clearMessages() {
  this.message = '';
  this.loginError = false;
  this.otpError = false;
}
  onLoginInputChange() {
  const loginValue = this.loginForm.get('login')?.value;
  const passwordControl = this.loginForm.get('password');
  
  // Clear previous error messages when user starts typing
  if (this.loginError) {
    this.clearMessages();
  }
  
  if (this.isPhone(loginValue)) {
    passwordControl?.clearValidators();
    passwordControl?.setErrors(null);
  } else {
    passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
  }
  passwordControl?.updateValueAndValidity();
}
  // handleSuccessfulLogin(token: string, user?: AuthUser) {
  //   this.cookieService.set('token', token, {
  //     secure: false,
  //     sameSite: 'Strict',
  //     path: '/',
  //     expires: 7
  //   });

  //   this.auth.saveToken(token);
  //   this.auth.setLoggedIn(true);
    
  //   if (this.auth.fetchUserProfile) {
  //     this.auth.fetchUserProfile();
  //   }
  //   if (isPlatformBrowser(this.platformId)) {
  //     const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
  //     if (redirectUrl) {
  //       sessionStorage.removeItem('redirectAfterLogin');
  //       this.router.navigate([redirectUrl]);
  //       return;
  //     }
  //   }
    
  //   // If no redirect URL or not in browser, just close modal
  //   this.closeModal();
  // }


//   handleSuccessfulLogin(token: string, user?: AuthUser) {
//   console.log('handleSuccessfulLogin called');
//   console.log('isPlatformBrowser:', isPlatformBrowser(this.platformId));
  
//   this.cookieService.set('token', token, {
//     secure: false,
//     sameSite: 'Strict',
//     path: '/',
//     expires: 7
//   });

//   this.auth.saveToken(token);
//   this.auth.setLoggedIn(true);
  
//   if (this.auth.fetchUserProfile) {
//     this.auth.fetchUserProfile();
//   }
  
//   // Check if there's a redirect URL stored (SSR-safe)
//   if (isPlatformBrowser(this.platformId)) {
//     const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
//     console.log('Retrieved redirectUrl:', redirectUrl);
//     if (redirectUrl) {
//       sessionStorage.removeItem('redirectAfterLogin');
//       console.log('Navigating to:', redirectUrl);
//       this.router.navigate([redirectUrl]);
//       return;
//     } else {
//       console.log('No redirect URL found in sessionStorage');
//     }
//   }
  
//   // If no redirect URL or not in browser, just close modal
//   console.log('Closing modal without redirect');
//   this.closeModal();
// }

handleSuccessfulLogin(token: string, user?: AuthUser) {
  this.cookieService.set('token', token, {
    secure: false,
    sameSite: 'Strict',
    path: '/',
    expires: 7
  });

  this.auth.saveToken(token);
  this.auth.setLoggedIn(true);
  
  if (this.auth.fetchUserProfile) {
    this.auth.fetchUserProfile();
  }
  
  // Check if there's a redirect URL passed from parent
  if (this.redirectUrl) {
    console.log('Navigating to redirectUrl:', this.redirectUrl);
    this.router.navigate([this.redirectUrl]);
    return;
  }
  
  // Fallback to sessionStorage check
  if (isPlatformBrowser(this.platformId)) {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      this.router.navigate([redirectUrl]);
      return;
    }
  }
  
  this.closeModal();
}
  closeModal() {
    this.close.emit();
    this.resetComponent();
  }

  closeOTPModal() {
    this.showOTPModal = false;
    this.otpError = false;
    this.clearOTPForm();
    this.clearCountdown();
  }

  resetComponent() {
    this.showOTPModal = false;
    this.showRecaptcha = false;
    this.loginError = false;
    this.otpError = false;
    this.message = '';
    this.currentUser = null;
    this.pendingUserId = null;
    this.phoneNumber = '';
    this.clearOTPForm();
    this.clearCountdown();
    

  }


// Fix the verifyOTP method:
verifyOTP() {
  if (this.otpForm.invalid) {
    this.otpForm.markAllAsTouched();
    return;
  }

  // Clear previous messages
  this.message = '';
  this.otpError = false;

  const otpValue = this.otpForm.value.digit1 + this.otpForm.value.digit2 + 
                   this.otpForm.value.digit3 + this.otpForm.value.digit4;

  const otpPayload = {
    login: this.loginForm.value.login,
    otp: otpValue
  };

  this.auth.otplogin(otpPayload).subscribe({
    next: (response) => {
      this.otpError = false;
      if (response.token) {
        this.message = 'Login successful!';
        this.handleSuccessfulLogin(response.token, response.user);
        this.showOTPModal = false;
        this.closeModal();
      }
    },
    error: (err) => {
      console.error('OTP verification error:', err);
      this.otpError = true;
      
      // Set specific error message
      if (err.error?.message) {
        this.message = err.error.message;
      } else if (err.status === 400) {
        this.message = 'Invalid OTP code. Please try again.';
      } else if (err.status === 410) {
        this.message = 'OTP code has expired. Please request a new one.';
        this.otpExpired = true;
      } else {
        this.message = 'OTP verification failed. Please try again.';
      }
    }
  });
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
  this.resendCountdown = 10; // 5 minutes in seconds

  this.countdownInterval = setInterval(() => {
    this.resendCountdown--;
    if (this.resendCountdown <= 0) {
      this.otpResendEnabled = true;
      this.otpExpired = true;
      this.clearCountdown();
    }
  }, 1000); // Runs every second
}


resendOTP(method: 'email' | 'whatsapp') {
  this.isResendingOTP = true;
  const loginValue = this.loginForm.get('login')?.value;

  const payload = {
    login: loginValue,
    // method: method
  };

  this.auth.resendOTP(payload).subscribe({
    next: (response) => {
      this.isResendingOTP = false;
      this.otpError = false;
      this.otpExpired = false;
      this.showOTPModal = true;
      this.startOTPCountdown();
      this.message = `Verification code resent successfully via ${method === 'email' ? 'Email' : 'SMS'}`;
    },
    error: (err) => {
      this.isResendingOTP = false;
      console.error('Error resending OTP:', err);
      this.otpError = true;
      this.message = `Failed to resend via ${method === 'email' ? 'Email' : 'SMS'}. Please try again.`;
    }
  });
}


  onOTPInputChange(event: any, nextField?: string) {
    const input = event.target;
    const value = input.value;
    
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) {
      input.value = '';
      return;
    }
    
    // Move to next field if value is entered
    if (value && nextField) {
      const nextInput = document.getElementById(nextField) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Move to previous field on backspace
    if (!value && event.inputType === 'deleteContentBackward') {
      const previousFields = ['digit1', 'digit2', 'digit3', 'digit4'];
      const currentIndex = previousFields.indexOf(input.id);
      if (currentIndex > 0) {
        const previousInput = document.getElementById(previousFields[currentIndex - 1]) as HTMLInputElement;
        if (previousInput) {
          previousInput.focus();
        }
      }
    }
  }

  ngOnDestroy() {
    this.clearCountdown();
    // if (this.recaptchaVerifier) {
    //   this.recaptchaVerifier.clear();
    // }
  }
}
