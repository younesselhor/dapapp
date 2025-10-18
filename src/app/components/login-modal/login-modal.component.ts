import { Component, EventEmitter, Output, OnDestroy, OnInit, PLATFORM_ID, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthUser } from '../../interfaces/user-interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginModalComponent implements OnDestroy, OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() redirectUrl: string | null = null;

  // Forms
  loginForm: FormGroup;
  otpForm: FormGroup;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;

  // Modal visibility
  showOTPModal = false;
  showRecaptcha = false;
  showForgotPasswordModal = false;
  showResetPasswordModal = false;

  // OTP state
  phoneNumber: string = '';
  userLogin = '';
  otpExpired = false;
  otpResendEnabled = false;
  resendCountdown = 30;
  countdownInterval: any;
  isResendingOTP = false;
  isVerifying = false;
  verificationStatus: 'success' | 'error' | null = null;

  // Error handling
  loginError = false;
  otpError = false;
  message: string = '';

  // UI state
  showPassword = false;
  isSigningInWithGoogle = false;

  // ViewChild references for OTP inputs
  @ViewChild('digit1Input') digit1Input!: ElementRef;
  @ViewChild('digit2Input') digit2Input!: ElementRef;
  @ViewChild('digit3Input') digit3Input!: ElementRef;
  @ViewChild('digit4Input') digit4Input!: ElementRef;

  // Unused properties (kept for potential future use)
  tokenExist: string = '';
  confirmationResult: any = null;
  recaptchaWidgetId: any = null;
  isPhoneLoginFlow = false;
  recaptchaLoaded = false;
  pendingUserId: number | null = null;
  currentUser: any = null;
  pendingUserInfo: any = null;

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
      digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]]
    });

    this.forgotPasswordForm = this.fb.group({
      login: ['', [Validators.required]],
      method: ['whatsapp', [Validators.required]]
    });

    this.resetPasswordForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.onLoginInputChange();
  }

  ngOnDestroy() {
    this.clearCountdown();
  }

  // ==================== LOGIN METHODS ====================

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

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
          this.focusFirstInput();
        } else {
          this.handleSuccessfulLogin(response.token, response.user);
        }
      },
      error: (err) => {
        this.loginError = true;
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
    
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
      return;
    }
    
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

  onLoginInputChange() {
    const loginValue = this.loginForm.get('login')?.value;
    const passwordControl = this.loginForm.get('password');
    
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

  // ==================== OTP METHODS ====================

  focusFirstInput() {
    setTimeout(() => {
      this.digit1Input?.nativeElement?.focus();
    }, 150);
  }

  onOTPInputChange(event: any, nextField?: string) {
    const input = event.target;
    const value = input.value;
    
    if (this.verificationStatus) {
      this.verificationStatus = null;
    }
    
    if (value && !/^[0-9]$/.test(value)) {
      input.value = '';
      return;
    }
    
    if (value && nextField) {
      const nextInput = document.getElementById(nextField) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    this.checkAndAutoSubmitOTP();
  }

  checkAndAutoSubmitOTP() {
    const digit1 = this.otpForm.get('digit1')?.value;
    const digit2 = this.otpForm.get('digit2')?.value;
    const digit3 = this.otpForm.get('digit3')?.value;
    const digit4 = this.otpForm.get('digit4')?.value;

    if (digit1 && digit2 && digit3 && digit4) {
      setTimeout(() => {
        if (this.otpForm.valid && !this.isVerifying) {
          this.verifyOTP();
        }
      }, 100);
    }
  }

  verifyOTP() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isVerifying = true;
    this.message = 'Verifying...';
    this.otpError = false;
    this.verificationStatus = null;

    const otpValue = this.otpForm.value.digit1 + this.otpForm.value.digit2 + 
                     this.otpForm.value.digit3 + this.otpForm.value.digit4;

    const otpPayload = {
      login: this.loginForm.value.login,
      otp: otpValue
    };

    this.auth.otplogin(otpPayload).subscribe({
      next: (response) => {
        this.otpError = false;
        this.verificationStatus = 'success';
        
        if (response.token) {
          this.message = '✓ Verification successful! Logging you in...';
          
          setTimeout(() => {
            this.handleSuccessfulLogin(response.token, response.user);
            this.showOTPModal = false;
            this.closeModal();
          }, 800);
        }
      },
      error: (err) => {
        console.error('OTP verification error:', err);
        this.isVerifying = false;
        this.otpError = true;
        this.verificationStatus = 'error';
        
        this.clearOTPForm();
        
        setTimeout(() => {
          this.digit1Input?.nativeElement.focus();
        }, 100);
        
        if (err.error?.message) {
          this.message = '✗ ' + err.error.message;
        } else if (err.status === 400) {
          this.message = '✗ Invalid OTP code. Please try again.';
        } else if (err.status === 410) {
          this.message = '✗ OTP code has expired. Please request a new one.';
          this.otpExpired = true;
        } else {
          this.message = '✗ OTP verification failed. Please try again.';
        }
        
        setTimeout(() => {
          this.verificationStatus = null;
        }, 2000);
      }
    });
  }

  handleKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    
    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      const prevInput = this.getInputByIndex(index - 1);
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
    
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.getInputByIndex(index - 1)?.focus();
    }
    
    if (event.key === 'ArrowRight' && index < 3) {
      event.preventDefault();
      this.getInputByIndex(index + 1)?.focus();
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 4);
    
    if (pastedData && pastedData.length === 4) {
      const digits = pastedData.split('');
      this.otpForm.patchValue({
        digit1: digits[0],
        digit2: digits[1],
        digit3: digits[2],
        digit4: digits[3]
      });
      
      this.digit4Input?.nativeElement.focus();
      
      setTimeout(() => {
        this.checkAndAutoSubmitOTP();
      }, 100);
    }
  }

  getInputClass(index: number): string {
    const digitValue = this.otpForm.get(`digit${index + 1}`)?.value;
    
    if (this.verificationStatus === 'error') {
      return 'otp-input-error shake';
    }
    
    if (this.verificationStatus === 'success') {
      return 'otp-input-success';
    }
    
    if (digitValue) {
      return 'otp-input-filled';
    }
    
    return 'otp-input-default';
  }

  private getInputByIndex(index: number): HTMLInputElement | null {
    const inputRefs = [
      this.digit1Input,
      this.digit2Input,
      this.digit3Input,
      this.digit4Input
    ];
    
    return inputRefs[index]?.nativeElement || null;
  }

  clearOTPForm() {
    this.otpForm.reset();
    this.verificationStatus = null;
    
    Object.keys(this.otpForm.controls).forEach(key => {
      this.otpForm.get(key)?.setErrors(null);
      this.otpForm.get(key)?.markAsUntouched();
    });
  }

  // ==================== OTP COUNTDOWN & RESEND ====================

  startOTPCountdown() {
    this.otpResendEnabled = false;
    this.resendCountdown = 60; // 5 minutes = 300 seconds

    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.otpResendEnabled = true;
        this.otpExpired = true;
        this.clearCountdown();
      }
    }, 1000);
  }

  clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  resendOTP(method: 'email' | 'whatsapp') {
    this.isResendingOTP = true;
    const loginValue = this.loginForm.get('login')?.value;

    const payload = {
      login: loginValue
    };

    this.auth.resendOTP(payload).subscribe({
      next: (response) => {
        this.isResendingOTP = false;
        this.otpError = false;
        this.otpExpired = false;
        this.showOTPModal = true;
        this.startOTPCountdown();
        this.focusFirstInput();
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

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ==================== FORGOT PASSWORD ====================

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

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('password_confirmation')?.value 
      ? null 
      : { mismatch: true };
  }

  // ==================== MODAL MANAGEMENT ====================

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

  // ==================== UTILITY METHODS ====================

  isEmail(value: string): boolean {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  isPhone(value: string): boolean {
    if (!value) return false;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
    return phoneRegex.test(value);
  }

  isValidPhoneNumber(phone: string): boolean {
    return /^\+?\d{10,15}$/.test(phone);
  }

  extractPhoneNumber(login: string): string {
    return this.isValidPhoneNumber(login) ? login : '';
  }

  clearMessages() {
    this.message = '';
    this.loginError = false;
    this.otpError = false;
  }

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (phone.startsWith('+')) {
      return phone;
    }
    
    if (cleaned.startsWith('00')) {
      return '+' + cleaned.substring(2);
    }
    
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '+212' + cleaned.substring(1);
    }
    
    if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7'))) {
      return '+212' + cleaned;
    }
    
    if (!phone.startsWith('+')) {
      return '+' + cleaned;
    }
    
    return phone;
  }
}