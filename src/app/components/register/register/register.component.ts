import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthUserDetails, MeResponse, RegisteredUser, RegistrationRequest, UserInterface } from '../../../interfaces/user-interface';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role_id: number;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    FormsModule], // Added FormsModule for ngModel
    providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted : boolean = false;
  tokenExist : string | null = null
  currentUser: AuthUserDetails | undefined
  modalMessage = '';
  showModal = false;
  apiErrors: { [key: string]: string } = {};
  
  // OTP Modal Properties
  showOtpModal = false;
  otpSentVia : string = '';
  tempToken = '';
  tempUser: any = null;
  otpCode = '';
  otpError = '';
  isVerifyingOtp = false;
  userEmail = ''; // Store user email for OTP verification


   isResendingOTP = false;
  constructor(private fb: FormBuilder, private messageService : MessageService, private http : HttpClient, private auth : AuthService ,
    private cookieService: CookieService,
    private router: Router,
  )
  {this.registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', Validators.required],
    role_id:1
  },
  {
    validators: this.passwordMatchValidator
  });
}

  ngOnInit(): void {
    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      delete this.apiErrors['email'];
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const password_confirmation = group.get('password_confirmation')?.value;
    return password === password_confirmation ? null : { passwordMismatch: true };
  }

//   onSubmit() {
//     if (this.registerForm.invalid) {
//       this.registerForm.markAllAsTouched();
//       return;
//     }

//     this.submitted = true;

//     const registerData: RegistrationRequest = this.registerForm.value;

//     // this.auth.register(registerData).subscribe({
//     //   next: (response) => {
//     //     const user = response.user;
//     //     this.tokenExist = response.token;

//     //     // Check if OTP is required
//     //     if (response.requiresOTP) {
//     //       // Store temporary data for OTP verification
//     //       this.tempToken = response.token;
//     //       this.tempUser = response.user;
//     //       this.otpSentVia = response.otp_sent_via ?? ''; // 'email' or 'whatsapp'
//     //       this.userEmail = response.user.email; // Store email for OTP API
          
//     //       // Show OTP modal
//     //       this.showOtpModal = true;
//     //       this.submitted = false; // Reset submitted state
//     //     } else if (this.tokenExist) {
//     //       // Direct login without OTP
//     //       this.handleSuccessfulLogin(response.token, response.user);
//     //     }
//     //   },
//     //   error: (error) => {
//     //     console.error('Registration error:', error);
//     //     this.submitted = false;
//     //     this.apiErrors = {}; // reset previous errors

//     //     const errorResponse = error.error;

//     //     for (const key in errorResponse) {
//     //       if (errorResponse.hasOwnProperty(key)) {
//     //         this.apiErrors[key] = errorResponse[key][0]; // just take the first error message
//     //       }
//     //     }
//     //   }
//     // });
//     this.auth.register(registerData).subscribe({
//   next: (response) => {
//     const user = response.user;
//     // this.tokenExist = response.token;

//     // Check if OTP is required - FIXED: changed requiresOTP to requiresOTP
//     if (response.requiresOTP) {
//       this.showOtpModal = true;
//       // Store temporary data for OTP verification
//       // this.tempToken = response.token;
//       this.tempUser = response.user;
//       this.otpSentVia = response.otp_sent_via ?? ''; // 'email' or 'whatsapp'
//       this.userEmail = response.user.email; // Store email for OTP API
//       // Add this at the beginning of your next callback for debugging:
// console.log('Registration response:', response);
// console.log('requiresOTP:', response.requiresOTP);
// console.log('otp_sent_via:', response.otp_sent_via);
//       // Show OTP modal
      
//       this.submitted = false; // Reset submitted state
//     }
//     //  else if (this.tokenExist) {
//     //   // Direct login without OTP
//     //   this.handleSuccessfulLogin(response.token, response.user);
//     // }
//   },
//     error: (error) => {
//         console.error('Registration error:', error);
//         this.submitted = false;
//         this.apiErrors = {}; // reset previous errors

//         const errorResponse = error.error;

//         for (const key in errorResponse) {
//           if (errorResponse.hasOwnProperty(key)) {
//             this.apiErrors[key] = errorResponse[key][0]; // just take the first error message
//           }
//         }
//       }

// });
//   }

onSubmit() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.submitted = true;

  const registerData: RegistrationRequest = this.registerForm.value;

  this.auth.register(registerData).subscribe({
    next: (response) => {
      
      // Check if OTP is required - FIXED: changed requiresOTP to requiresOTP
      if (response.requiresOTP) {
        
        // Store temporary data for OTP verification
        this.tempToken = response.token;
        this.tempUser = response.user;
        this.otpSentVia = response.otp_sent_via ?? ''; // 'email' or 'whatsapp'
        this.userEmail = response.user.email; // Store email for OTP API
        
        // Show OTP modal
        this.showOtpModal = true;
        this.submitted = false; // Reset submitted state
      } else if (response.token) {
        // Direct login without OTP
        this.handleSuccessfulLogin(response.token, response.user);
      }
    },
    error: (error) => {
      console.error('Registration error:', error);
      this.submitted = false;
      this.apiErrors = {}; // reset previous errors

      const errorResponse = error.error;

      for (const key in errorResponse) {
        if (errorResponse.hasOwnProperty(key)) {
          this.apiErrors[key] = errorResponse[key][0]; // just take the first error message
        }
      }
    }
  });
}
  // Method to verify OTP
  // verifyOtp() {
  //   if (!this.otpCode || this.otpCode.length !== 4) {
  //     this.otpError = 'Please enter a valid 4-digit OTP code';
  //     return;
  //   }

  //   this.isVerifyingOtp = true;
  //   this.otpError = '';

  //   const otpData = {
  //     login: this.userEmail, // Use email as login
  //     otp: this.otpCode
  //   };

  //   // Call the verify OTP API
  //   this.http.post('https://be.dabapp.co/api/verify-otp', otpData).subscribe({
  //     next: (response: any) => {
  //       this.isVerifyingOtp = false;
  //       this.showOtpModal = false;
        
  //       // Handle successful OTP verification - use the original token from registration
  //       this.handleSuccessfulLogin(this.tempToken, this.tempUser);
        
  //       // Clear temporary data
  //       this.clearTempData();
  //     },
  //     error: (error) => {
  //       console.error('OTP verification error:', error);
  //       this.isVerifyingOtp = false;
        
  //       if (error.error && error.error.message) {
  //         this.otpError = error.error.message;
  //       } else {
  //         this.otpError = 'Invalid OTP code. Please try again.';
  //       }
  //     }
  //   });
  // }

  verifyOtp() {
  if (!this.otpCode || this.otpCode.length !== 4) {
    this.otpError = 'Please enter a valid 4-digit OTP code';
    return;
  }

  this.isVerifyingOtp = true;
  this.otpError = '';

  const otpData = {
    login: this.userEmail,  // still using email as login
    otp: this.otpCode
  };

  this.auth.otplogin(otpData).subscribe({
    next: (response) => {
      this.isVerifyingOtp = false;
      this.showOtpModal = false;

      // handleSuccessfulLogin now uses the token saved in AuthService
      this.handleSuccessfulLogin(response.token, response.user);

      // Clear temporary data
      this.clearTempData();
    },
    error: (error) => {
      console.error('OTP verification error:', error);
      this.isVerifyingOtp = false;

      if (error.error && error.error.message) {
        this.otpError = error.error.message;
      } else {
        this.otpError = 'Invalid OTP code. Please try again.';
      }
    }
  });
}

  // Method to resend OTP
resendOTP() {
  this.isResendingOTP = true;
  const phoneValue = this.registerForm.get('phone')?.value;

  const payload = {
    login: phoneValue,
    // method: method
  };

  this.auth.resendOTP(payload).subscribe({
    next: (response) => {
      this.isResendingOTP = false;
      // this.otpError = false;
      // this.otpExpired = false;
      // this.showOTPModal = true;
      // this.startOTPCountdown();
      // this.message = `Verification code resent successfully via ${method === 'email' ? 'Email' : 'SMS'}`;
    },
    error: (err) => {
      this.isResendingOTP = false;
      console.error('Error resending OTP:', err);
      // this.otpError = true;
      // this.message = `Failed to resend via ${method === 'email' ? 'Email' : 'SMS'}. Please try again.`;
    }
  });
}

  // Method to close OTP modal
  closeOtpModal() {
    this.showOtpModal = false;
    this.clearTempData();
  }

  // Method to clear temporary data
  private clearTempData() {
    this.tempToken = '';
    this.tempUser = null;
    this.otpCode = '';
    this.otpError = '';
    this.otpSentVia = '';
    this.userEmail = '';
  }

  // Method to handle OTP input (restrict to numbers only and 4 digits)
  onOtpInput(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.otpCode = value.substring(0, 4); // Limit to 4 digits
    event.target.value = this.otpCode;
    
    // Clear error when user starts typing
    if (this.otpError) {
      this.otpError = '';
    }
  }

  onCancel() {
    this.registerForm.reset();
  }

  handleSuccessfulLogin(token: string, user: RegisteredUser) {
   this.cookieService.set('token', token, {
         secure: false,
         sameSite: 'Strict',
         path: '/',
         expires: 7
       });
       this.auth.getProfile().subscribe({
         next: (res :MeResponse ) => {
           this.currentUser = res.user;
         }
       });
       this.auth.setLoggedIn(true);
       this.router.navigate(['/home']);
  }

  closeModal() {
    this.showModal = false;
  }
}