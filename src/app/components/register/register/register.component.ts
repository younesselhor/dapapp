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
    RouterModule],
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
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitted = true;

    const registerData: RegistrationRequest = this.registerForm.value;

    this.auth.register(registerData).subscribe({
      next: (response) => {
        const user = response.user;
        this.tokenExist = response.token;

        if (this.tokenExist) {
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
        // console.error('Registration error:', error);
        // this.submitted = false;

        // const errorResponse = error.error;
        // if (errorResponse.email) {
        //   this.modalMessage = errorResponse.email[0];
        //   console.log( this.modalMessage );

        // } else if (errorResponse.phone) {
        //   this.modalMessage = errorResponse.phone[0];
        //   console.log( this.modalMessage );
        // } else {
        //   this.modalMessage = 'An unexpected error occurred. Please try again.';
        // }

        // this.showModal = true;
      }

    });
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
