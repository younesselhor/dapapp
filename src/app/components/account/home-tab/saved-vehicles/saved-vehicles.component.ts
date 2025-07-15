import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { response } from 'express';
import { Listing, MeResponse } from '../../../../interfaces/user-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-vehicles',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './saved-vehicles.component.html',
  styleUrl: './saved-vehicles.component.css'
})
export class SavedVehiclesComponent implements OnInit {
  listingarray: Listing[] = [];
  loading = true;
  error = '';
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getProfile();
  this.auth.userProfile$.subscribe({
    next: (res) => {
      if (res && res.user && res.user.wishlists) {
        this.listingarray = res.user.wishlists.map(wishlist => wishlist.listing);
        console.log('this.listingarray: ', this.listingarray);
      } else {
        this.listingarray = [];
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Error reading user profile from stream:', err);
      this.listingarray = [];
      this.error = 'Failed to load wishlist items.';
      this.loading = false;
    }
  });
}



}
