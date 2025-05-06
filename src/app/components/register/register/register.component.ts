import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthUserDetails, MeResponse, RegistrationRequest, UserInterface } from '../../../interfaces/user-interface';
import { HttpClient } from '@angular/common/http';
// import { response, Router } from 'express';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

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
  registerForm: FormGroup = new FormGroup({});
  submitted : boolean = false;
  tokenExist : string | null = null
    currentUser: AuthUserDetails | undefined
    modalMessage = '';
    showModal = false;

  constructor(private fb: FormBuilder, private messageService : MessageService, private http : HttpClient, private auth : AuthService ,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      role_id:1
    }, {
      validators: this.passwordMatchValidator
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

        const errorResponse = error.error;
        if (errorResponse.email) {
          this.modalMessage = errorResponse.email[0]; // "The email has already been taken."
        } else if (errorResponse.phone) {
          this.modalMessage = errorResponse.phone[0];
        } else {
          this.modalMessage = 'An unexpected error occurred. Please try again.';
        }

        this.showModal = true;
      }
    });
  }

  onCancel() {
    this.registerForm.reset();
  }

  handleSuccessfulLogin(token: string, user: any) {
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
  closeModal() {
    this.showModal = false;
  }
}
