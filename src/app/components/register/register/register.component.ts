import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { UserInterface } from '../../../interfaces/user-interface';
import { HttpClient } from '@angular/common/http';
// import { response, Router } from 'express';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  constructor(private fb: FormBuilder, private messageService : MessageService, private http : HttpClient, private auth : AuthService ,
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
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }


this.submitted = true;
this.auth.register(this.registerForm.value).subscribe({
 next : (response) => {
  console.log('Registration successful:', response);
const user = response.user;
this.tokenExist = response.token
if(this.tokenExist){
  this.handleSuccessfulLogin(response.token, response.user);

}
},




  // const login  = this.loginForm.value;
  // this.userLogin = login.login;

  // this.auth.login(login).subscribe({
  //   next: (response) => {
  //     console.log('Login successful:', response);
  //     this.loginError = false;

  //     const user = response;

  //     if (response.requiresOTP) {
  //       this.phoneNumber = user.phone;
  //       // this.userId = user.user_id;
  //       this.showOTPModal = true;
  //       // this.sendOTP();
  //     } else {
  //       this.handleSuccessfulLogin(response.token, response.user);
  //     }
  //   },
  //   error: (err) => {
  //     this.loginError = true;
  //     console.error('Login error:', err);
  //   }
  // });
})

  }

  onCancel() {
    this.registerForm.reset();
  }

  handleSuccessfulLogin(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/plates']);
  }
}
