// import { Component, EventEmitter, Output, OnDestroy, inject, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CookieService } from 'ngx-cookie-service';
// import { AuthService } from '../services/auth.service';
// import { CommonModule } from '@angular/common';
// import { AuthUser } from '../interfaces/user-interface';
// import { Router, RouterLink } from '@angular/router';
// import { Auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

// @Component({
//   selector: 'app-login-modal',
//   templateUrl: './login-modal.component.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
// })
// export class LoginModalComponent implements OnDestroy, OnInit {
//   private authInstance = inject(Auth);
//   @Output() close = new EventEmitter<void>();

//   loginForm: FormGroup;
//   otpForm: FormGroup;
//   showOTPModal = false;
//   loginError = false;
//   phoneNumber: string = '';
//   tokenExist: string = '';
//   otpExpired = false;
//   otpResendEnabled = false;
//   countdownInterval: any;
//   resendCountdown = 30;
//   userLogin = '';
//   otpError = false;
//   recaptchaVerifier: RecaptchaVerifier | null = null;
//   confirmationResult: any = null;
//   message: string = '';
//   recaptchaWidgetId: any = null;
//   isPhoneLoginFlow = false;
//   recaptchaLoaded = false;
//   pendingUserId: number | null = null;
//   currentUser: any = null;
//   showRecaptcha = false;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private cookieService: CookieService,
//     private router: Router,
//   ) {
//     this.loginForm = this.fb.group({
//       login: ['', Validators.required],
//       password: ['', [Validators.minLength(6)]]
//     });
    
//     this.otpForm = this.fb.group({
//       digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
//       digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
//       digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
//       digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
//       digit5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
//       digit6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
//     });
//   }

//   ngOnInit() {
//     this.onLoginInputChange();
//     this.loadRecaptcha();
//   }

//   loadRecaptcha() {
//     const script = document.createElement('script');
//     script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
//     script.async = true;
//     script.defer = true;
//     script.onload = () => {
//       this.recaptchaLoaded = true;
//     };
//     document.body.appendChild(script);
//   }

//   async initRecaptcha(): Promise<void> {
//     const container = document.getElementById('recaptcha-container');
//     if (!container) throw new Error('Recaptcha container not found');
    
//     // Clear previous instance
//     container.innerHTML = '';

//     this.recaptchaVerifier = new RecaptchaVerifier(this.authInstance, 'recaptcha-container', {
//       'size': 'normal',
//       'callback': (response: string) => {
//         console.log('reCAPTCHA verified');
//         // Automatically send OTP after verification
//         this.sendFirebaseOTP(); 
//       },
//       'expired-callback': () => {
//         this.message = 'reCAPTCHA expired. Please try again.';
//       },
//       'error-callback': (error: any) => {
//         this.message = 'reCAPTCHA error. Please reload.';
//       }
//     });

//     await this.recaptchaVerifier.render();
//   }

//   // Format phone number to international format
//   formatPhoneNumber(phone: string): string {
//     // Remove all non-digit characters
//     const cleaned = phone.replace(/\D/g, '');
    
//     // If it starts with +, keep it
//     if (phone.startsWith('+')) {
//       return phone;
//     }
    
//     // If it starts with 00, replace with +
//     if (cleaned.startsWith('00')) {
//       return '+' + cleaned.substring(2);
//     }
    
//     // If it's a Moroccan number starting with 0, add +212
//     if (cleaned.startsWith('0') && cleaned.length === 10) {
//       return '+212' + cleaned.substring(1);
//     }
    
//     // If it's already without country code and looks like Moroccan
//     if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7'))) {
//       return '+212' + cleaned;
//     }
    
//     // For other countries, assume user provides correct format
//     if (!phone.startsWith('+')) {
//       return '+' + cleaned;
//     }
    
//     return phone;
//   }

//   async onSubmit() {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     }

//     const login = this.loginForm.get('login')?.value?.trim() || '';
//     const password = this.loginForm.get('password')?.value?.trim() || '';

//     if (this.isEmail(login)) {
//       this.auth.loginWithEmailPassword(login, password).subscribe({
//         next: (res) => {
//           this.message = 'Connexion réussie (email)';
//           this.closeModal();
//         },
//         error: (err) => {
//           this.message = err.error?.message || 'Erreur email';
//           this.loginError = true;
//         },
//       });
//     } else if (this.isPhone(login)) {
//       await this.handlePhonePasswordLogin(login, password);
//     } else {
//       this.message = 'Email ou numéro invalide';
//       this.loginError = true;
//     }
//   }

//   async handlePhonePasswordLogin(phone: string, password: string) {
//     try {
//       // Format phone number to international format
//       const formattedPhone = this.formatPhoneNumber(phone);
//       this.phoneNumber = formattedPhone;

//       // 1. First verify with your backend
//       const response = await this.auth.loginWithPhonePassword(formattedPhone, password).toPromise();
      
//       if (response.requiresFirebaseOTP) {
//         this.currentUser = response;
//         this.pendingUserId = response.user_id;
        
//         // Show reCAPTCHA for verification
//         this.showRecaptcha = true;
//         this.message = 'Please complete the reCAPTCHA verification to receive SMS code';
        
//         // Initialize reCAPTCHA
//         setTimeout(() => {
//           this.initRecaptcha();
//         }, 100);
        
//       } else {
//         // Handle direct login (no OTP required)
//         this.handleSuccessfulLogin(response.token, response.user);
//       }
//     } catch (error: any) {
//       this.message = error.error?.message || 'Login failed';
//       this.loginError = true;
//     }
//   }

//   async sendFirebaseOTP() {
//     try {
//       if (!this.recaptchaVerifier) {
//         throw new Error('reCAPTCHA not initialized');
//       }

//       this.message = 'Sending SMS code...';
      
//       // Send SMS via Firebase
//       this.confirmationResult = await signInWithPhoneNumber(
//         this.authInstance, 
//         this.phoneNumber, 
//         this.recaptchaVerifier
//       );
      
//       // Hide reCAPTCHA and show OTP modal
//       this.showRecaptcha = false;
//       this.showOTPModal = true;
//       this.startOTPCountdown();
//       this.message = 'SMS code sent successfully to ' + this.phoneNumber;
      
//     } catch (error: any) {
//       console.error('Firebase SMS Error:', error);
//       this.message = this.getFirebaseErrorMessage(error);
//       this.loginError = true;
      
//       // Reset recaptcha on error
//       if (this.recaptchaVerifier) {
//         this.recaptchaVerifier.clear();
//         this.recaptchaVerifier = null;
//       }
//       this.showRecaptcha = false;
//     }
//   }

//   async verifyOTP() {
//     if (this.otpForm.invalid) {
//       this.otpForm.markAllAsTouched();
//       return;
//     }
    
//     const otp = Object.values(this.otpForm.value).join('');
//     this.message = 'Verifying OTP...';

//     try {
//       // 1. First verify OTP with backend
//       const verifyResponse = await this.auth.verifyOtp(this.pendingUserId!, otp).toPromise();
      
//       // 2. Confirm with Firebase to get ID token
//       const credential = await this.confirmationResult.confirm(otp);
//       const idToken = await credential.user.getIdToken();
      
//       // 3. Complete authentication with backend using Firebase ID token
//       const finalResponse = await this.auth.completeFirebaseAuth(this.pendingUserId!, idToken).toPromise();
      
//       // 4. Handle successful login
//       this.handleSuccessfulLogin(finalResponse.token, finalResponse.user);
//       this.showOTPModal = false;
//       this.closeModal();
      
//     } catch (error: any) {
//       console.error('OTP Verification Error:', error);
//       if (error.code && error.code.includes('auth/')) {
//         this.message = this.getFirebaseErrorMessage(error);
//       } else {
//         this.message = error.error?.message || 'OTP verification failed';
//       }
//       this.otpError = true;
//     }
//   }

//   getFirebaseErrorMessage(error: any): string {
//     switch (error.code) {
//       case 'auth/invalid-phone-number':
//         return 'Invalid phone number format. Please use international format (+country code)';
//       case 'auth/too-many-requests':
//         return 'Too many attempts. Please try again later.';
//       case 'auth/captcha-check-failed':
//         return 'reCAPTCHA verification failed. Please try again.';
//       case 'auth/invalid-verification-code':
//         return 'Invalid OTP code. Please check and try again.';
//       case 'auth/code-expired':
//         return 'OTP code expired. Please request a new one.';
//       case 'auth/quota-exceeded':
//         return 'SMS quota exceeded. Please try again later.';
//       default:
//         return error.message || 'An error occurred. Please try again.';
//     }
//   }

//   async loginWithGoogle() {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(this.authInstance, provider);
//       const user = result.user;
//       const idToken = await user.getIdToken();

//       this.auth.loginWithFirebaseToken(idToken).subscribe({
//         next: (res) => {
//           if (res.token) {
//             this.handleSuccessfulLogin(res.token, res.user);
//           }
//         },
//         error: (err) => {
//           console.error('Backend login error:', err);
//           this.message = 'Google login failed';
//         }
//       });

//     } catch (error) {
//       console.error('Google login error:', error);
//       this.message = 'Google login error';
//     }
//   }

//   isEmail(value: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(value);
//   }

//   isPhone(value: string): boolean {
//     // More flexible phone regex for international numbers
//     const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
//     return phoneRegex.test(value);
//   }

//   onLoginInputChange() {
//     const loginValue = this.loginForm.get('login')?.value;
//     const passwordControl = this.loginForm.get('password');
    
//     if (this.isPhone(loginValue)) {
//       // For phone login, password is optional (will trigger OTP)
//       passwordControl?.clearValidators();
//       passwordControl?.setErrors(null);
//     } else {
//       // For email login, password is required
//       passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
//     }
//     passwordControl?.updateValueAndValidity();
//   }

//   handleSuccessfulLogin(token: string, user?: AuthUser) {
//     this.cookieService.set('token', token, {
//       secure: false,
//       sameSite: 'Strict',
//       path: '/',
//       expires: 7
//     });

//     this.auth.saveToken(token);
//     this.auth.setLoggedIn(true);
    
//     if (this.auth.fetchUserProfile) {
//       this.auth.fetchUserProfile();
//     }
    
//     this.router.navigate(['/home']);
//   }

//   closeModal() {
//     this.close.emit();
//     this.resetComponent();
//   }

//   closeOTPModal() {
//     this.showOTPModal = false;
//     this.otpError = false;
//     this.clearOTPForm();
//     this.clearCountdown();
//   }

//   closeRecaptcha() {
//     this.showRecaptcha = false;
//     if (this.recaptchaVerifier) {
//       this.recaptchaVerifier.clear();
//       this.recaptchaVerifier = null;
//     }
//   }

//   resetComponent() {
//     this.showOTPModal = false;
//     this.showRecaptcha = false;
//     this.loginError = false;
//     this.otpError = false;
//     this.message = '';
//     this.currentUser = null;
//     this.pendingUserId = null;
//     this.phoneNumber = '';
//     this.clearOTPForm();
//     this.clearCountdown();
    
//     if (this.recaptchaVerifier) {
//       this.recaptchaVerifier.clear();
//       this.recaptchaVerifier = null;
//     }
//   }

//   clearOTPForm() {
//     this.otpForm.reset();
//   }

//   clearCountdown() {
//     if (this.countdownInterval) {
//       clearInterval(this.countdownInterval);
//     }
//   }

//   startOTPCountdown() {
//     this.otpResendEnabled = false;
//     this.resendCountdown = 30;
    
//     this.countdownInterval = setInterval(() => {
//       this.resendCountdown--;
//       if (this.resendCountdown <= 0) {
//         this.otpResendEnabled = true;
//         this.otpExpired = true;
//         this.clearCountdown();
//       }
//     }, 1000);
//   }

//   async resendOTP() {
//     if (!this.otpResendEnabled) return;
    
//     this.otpExpired = false;
//     this.otpError = false;
//     this.clearOTPForm();
    
//     // Show reCAPTCHA again for resend
//     this.showOTPModal = false;
//     this.showRecaptcha = true;
//     this.message = 'Complete reCAPTCHA to resend SMS code';
    
//     try {
//       await this.initRecaptcha();
//     } catch (error: any) {
//       console.error('Error initializing reCAPTCHA for resend:', error);
//       this.message = 'Error initializing verification. Please try again.';
//       this.showRecaptcha = false;
//       this.showOTPModal = true;
//     }
//   }

//   onOTPInputChange(event: any, nextField?: string) {
//     const input = event.target;
//     const value = input.value;
    
//     // Only allow numbers
//     if (value && !/^[0-9]$/.test(value)) {
//       input.value = '';
//       return;
//     }
    
//     // Move to next field if value is entered
//     if (value && nextField) {
//       const nextInput = document.getElementById(nextField) as HTMLInputElement;
//       if (nextInput) {
//         nextInput.focus();
//       }
//     }
    
//     // Move to previous field on backspace
//     if (!value && event.inputType === 'deleteContentBackward') {
//       const previousFields = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6'];
//       const currentIndex = previousFields.indexOf(input.id);
//       if (currentIndex > 0) {
//         const previousInput = document.getElementById(previousFields[currentIndex - 1]) as HTMLInputElement;
//         if (previousInput) {
//           previousInput.focus();
//         }
//       }
//     }
//   }

//   ngOnDestroy() {
//     this.clearCountdown();
//     if (this.recaptchaVerifier) {
//       this.recaptchaVerifier.clear();
//     }
//   }
// }

import { Component, EventEmitter, Output, OnDestroy, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AuthUser } from '../interfaces/user-interface';
import { Router, RouterLink } from '@angular/router';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';



@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginModalComponent implements OnDestroy, OnInit {
  private authInstance = inject(Auth);
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
  recaptchaVerifier: RecaptchaVerifier | null = null;
  confirmationResult: any = null;
  message: string = '';
  recaptchaWidgetId: any = null;
  isPhoneLoginFlow = false;
  recaptchaLoaded = false;
  pendingUserId: number | null = null;
  currentUser: any = null;
  showRecaptcha = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cookieService: CookieService,
    private router: Router,
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
      digit5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
  }

  ngOnInit() {
    this.onLoginInputChange();
    this.loadRecaptcha();
  }

  
  loadRecaptcha() {
    // Check if script already exists
    if (document.querySelector('script[src*="recaptcha"]')) {
      this.recaptchaLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.recaptchaLoaded = true;
      console.log('reCAPTCHA script loaded');
    };
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      this.message = 'Failed to load verification system';
    };
    document.head.appendChild(script);
  }

  async initRecaptcha(): Promise<void> {
    try {
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        throw new Error('Recaptcha container not found');
      }
      
      // Clear previous instance
      container.innerHTML = '';

      // Clear any existing verifier
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Previous verifier already cleared');
        }
        this.recaptchaVerifier = null;
      }

      console.log('Initializing reCAPTCHA for phone:', this.phoneNumber);

      this.recaptchaVerifier = new RecaptchaVerifier(this.authInstance, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response: string) => {
          console.log('reCAPTCHA verified, response:', response.substring(0, 50) + '...');
          // Automatically send OTP after verification
          this.sendFirebaseOTP(); 
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.message = 'reCAPTCHA expired. Please try again.';
          this.loginError = true;
        },
        'error-callback': (error: any) => {
          console.error('reCAPTCHA error:', error);
          this.message = 'reCAPTCHA error. Please try again.';
          this.loginError = true;
        }
      });

      console.log('Rendering reCAPTCHA...');
      await this.recaptchaVerifier.render();
      console.log('reCAPTCHA rendered successfully');
      
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      this.message = 'Failed to initialize verification. Please refresh the page.';
      this.loginError = true;
      throw error;
    }
  }

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

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const login = this.loginForm.get('login')?.value?.trim() || '';
    const password = this.loginForm.get('password')?.value?.trim() || '';

    if (this.isEmail(login)) {
      this.auth.loginWithEmailPassword(login, password).subscribe({
        next: (res) => {
          this.message = 'Connexion réussie (email)';
          this.closeModal();
        },
        error: (err) => {
          this.message = err.error?.message || 'Erreur email';
          this.loginError = true;
        },
      });
    } else if (this.isPhone(login)) {
      await this.handlePhonePasswordLogin(login, password);
    } else {
      this.message = 'Email ou numéro invalide';
      this.loginError = true;
    }
  }

  async handlePhonePasswordLogin(phone: string, password: string) {
    try {
      // Format phone number to international format
      const formattedPhone = this.formatPhoneNumber(phone);
      this.phoneNumber = formattedPhone;

      // 1. First verify with your backend
      const response = await this.auth.loginWithPhonePassword(formattedPhone, password).toPromise();
      
      if (response.requiresFirebaseOTP) {
        this.currentUser = response;
        this.pendingUserId = response.user_id;
        
        // Show reCAPTCHA for verification
        this.showRecaptcha = true;
        this.message = 'Please complete the reCAPTCHA verification to receive SMS code';
        
        // Initialize reCAPTCHA
        setTimeout(() => {
          this.initRecaptcha();
        }, 100);
        
      } else {
        // Handle direct login (no OTP required)
        this.handleSuccessfulLogin(response.token, response.user);
      }
    } catch (error: any) {
      this.message = error.error?.message || 'Login failed';
      this.loginError = true;
    }
  }

  async sendFirebaseOTP() {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      if (!this.phoneNumber) {
        throw new Error('Phone number not set');
      }

      console.log('Sending Firebase OTP to:', this.phoneNumber);
      this.message = 'Sending SMS code...';
      this.loginError = false;
      
      // Send SMS via Firebase
      this.confirmationResult = await signInWithPhoneNumber(
        this.authInstance, 
        this.phoneNumber, 
        this.recaptchaVerifier
      );
      
      console.log('SMS sent successfully, confirmationResult:', this.confirmationResult);
      
      // Hide reCAPTCHA and show OTP modal
      this.showRecaptcha = false;
      this.showOTPModal = true;
      this.startOTPCountdown();
      this.message = 'SMS code sent successfully to ' + this.phoneNumber;
      
    } catch (error: any) {
      console.error('Firebase SMS Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      this.message = this.getFirebaseErrorMessage(error);
      this.loginError = true;
      
      // Reset recaptcha on error
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Error clearing verifier:', e);
        }
        this.recaptchaVerifier = null;
      }
      this.showRecaptcha = false;
    }
  }

  async verifyOTP() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    
    const otp = Object.values(this.otpForm.value).join('');
    this.message = 'Verifying OTP...';

    try {
      // 1. First verify OTP with backend
      const verifyResponse = await this.auth.verifyOtp(this.pendingUserId!, otp).toPromise();
      
      // 2. Confirm with Firebase to get ID token
      const credential = await this.confirmationResult.confirm(otp);
      const idToken = await credential.user.getIdToken();
      
      // 3. Complete authentication with backend using Firebase ID token
      const finalResponse = await this.auth.completeFirebaseAuth(this.pendingUserId!, idToken).toPromise();
      
      // 4. Handle successful login
      this.handleSuccessfulLogin(finalResponse.token, finalResponse.user);
      this.showOTPModal = false;
      this.closeModal();
      
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
      if (error.code && error.code.includes('auth/')) {
        this.message = this.getFirebaseErrorMessage(error);
      } else {
        this.message = error.error?.message || 'OTP verification failed';
      }
      this.otpError = true;
    }
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

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.authInstance, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      this.auth.loginWithFirebaseToken(idToken).subscribe({
        next: (res) => {
          if (res.token) {
            this.handleSuccessfulLogin(res.token, res.user);
          }
        },
        error: (err) => {
          console.error('Backend login error:', err);
          this.message = 'Google login failed';
        }
      });

    } catch (error) {
      console.error('Google login error:', error);
      this.message = 'Google login error';
    }
  }

  isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  isPhone(value: string): boolean {
    // More flexible phone regex for international numbers
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
    return phoneRegex.test(value);
  }

  onLoginInputChange() {
    const loginValue = this.loginForm.get('login')?.value;
    const passwordControl = this.loginForm.get('password');
    
    if (this.isPhone(loginValue)) {
      // For phone login, password is optional (will trigger OTP)
      passwordControl?.clearValidators();
      passwordControl?.setErrors(null);
    } else {
      // For email login, password is required
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    passwordControl?.updateValueAndValidity();
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
    
    this.router.navigate(['/home']);
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

  closeRecaptcha() {
    this.showRecaptcha = false;
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
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
    
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
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

  async resendOTP() {
    if (!this.otpResendEnabled) return;
    
    this.otpExpired = false;
    this.otpError = false;
    this.clearOTPForm();
    
    // Show reCAPTCHA again for resend
    this.showOTPModal = false;
    this.showRecaptcha = true;
    this.message = 'Complete reCAPTCHA to resend SMS code';
    
    try {
      await this.initRecaptcha();
    } catch (error: any) {
      console.error('Error initializing reCAPTCHA for resend:', error);
      this.message = 'Error initializing verification. Please try again.';
      this.showRecaptcha = false;
      this.showOTPModal = true;
    }
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
      const previousFields = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6'];
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
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
    }
  }
}