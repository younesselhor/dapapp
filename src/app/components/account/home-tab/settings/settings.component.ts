import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../../../services/auth.service';
import { AuthUserDetails } from '../../../../interfaces/user-interface';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
userInfo: AuthUserDetails | null = null;
  profileForm: FormGroup;
  loading = true;
  error = '';
  constructor(private fb: FormBuilder,private auth: AuthService) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: this.fb.group({
        day: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(31)])],
        month: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(12)])],
        year: ['', Validators.compose([Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())])],
      }),
      phone: ['+966 34832431', Validators.required]
    });

}


ngOnInit(): void {
  this.auth.userProfile$.subscribe({
    next: (res) => {
      if (res && res.user) {
        this.userInfo = res.user;

        // Populate the form with user data
        this.profileForm.patchValue({
          firstName: this.userInfo.first_name || '',
          lastName: this.userInfo.last_name || '',
          email: this.userInfo.email || '',
          phone: this.userInfo.phone || '',
          birthday: {
            day: '',   // if birthday is available, extract the day
            month: '', // and month
            year: ''   // and year
          }
        });

        // If you later decide to handle a `birthday` value:
        if (this.userInfo.birthday) {
          const birthDate = new Date(this.userInfo.birthday);
          this.profileForm.patchValue({
            birthday: {
              day: birthDate.getDate().toString(),
              month: (birthDate.getMonth() + 1).toString(),
              year: birthDate.getFullYear().toString()
            }
          });
        }
      } else {
        this.userInfo = null;
      }
    },
    error: (err) => {
      console.error('Error reading user profile from stream:', err);
      this.userInfo = null;
      this.error = 'Failed to load wishlist items.';
      this.loading = false;
    }
  });
}

  // ngOnInit(): void {
  //   this.auth.userProfile$.subscribe({
  //     next: (res) => {
  //       if (res && res.user) {
  //         this.userInfo = res.user;
  //         console.log(' this.userInfo : ',  this.userInfo );
  //         // this.listingarray = res.user.wishlists.map(wishlist => wishlist.listing);
  //       } else {
  //         // this.listingarray = [];
  //         this.userInfo = null;
  //       }
  //       // this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error reading user profile from stream:', err);
  //       this.userInfo = null;
  //       this.error = 'Failed to load wishlist items.';
  //       this.loading = false;
  //     }
  //   });







  //   this.profileForm = this.fb.group({
  //     firstName: ['', Validators.required],
  //     lastName: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]],
  //     birthday: this.fb.group({
  //       day: ['', Validators.required],
  //       month: ['', Validators.required],
  //       year: ['', Validators.required],
  //     }),
  //     phone: ['+966 34832431', Validators.required]
  //   });
  // }

  padZero(value: number | string): string {
    return value.toString().padStart(2, '0');
  }

  get birthdayGroup() {
    return this.profileForm.get('birthday') as FormGroup;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      console.warn('Form invalid:', this.profileForm.value);
      return;
    }

    const formValue = this.profileForm.value;

    // Format the birthday as 'YYYY-MM-DD'
    const birthday = `${formValue.birthday.year}-${this.padZero(formValue.birthday.month)}-${this.padZero(formValue.birthday.day)}`;

    const payload = {
      first_name: formValue.firstName,
      last_name: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      birthday: birthday
    };

    this.auth.updateUser(payload).subscribe({
      next: (response) => {
        this.auth.fetchUserProfile();
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating user:', error);
        // optionally show an error toast
      }
    });
  }

}
