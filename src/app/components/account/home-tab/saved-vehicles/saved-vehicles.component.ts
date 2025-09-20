import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { response } from 'express';
import { Listing, MeResponse } from '../../../../interfaces/user-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../postingAdd/product-form/listingService/listing-service.service';

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
  constructor(private auth: AuthService,private listingService : ListingService) {}

  ngOnInit(): void {
    this.getwishlist();
  //   this.auth.getProfile();
  // this.auth.userProfile$.subscribe({
  //   next: (res) => {
  //     if (res && res.user && res.user.wishlists) {
  //       this.listingarray = res.user.wishlists.map(wishlist => wishlist.listing);
  //     } else {
  //       this.listingarray = [];
  //     }
  //     this.loading = false;
  //   },
  //   error: (err) => {
  //     console.error('Error reading user profile from stream:', err);
  //     this.listingarray = [];
  //     this.error = 'Failed to load wishlist items.';
  //     this.loading = false;
  //   }
  // });
}
getwishlist() {
  this.listingService.getWishlist().subscribe({
    next: (res) => {
      // The API response has the wishlist items under 'data' property
      if (res && res.data && Array.isArray(res.data)) {
        this.listingarray = res.data.map((wishlistItem: any) => wishlistItem.listing);
      } else {
        this.listingarray = [];
      }
      this.loading = false;
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error fetching wishlist:', err);
      this.listingarray = [];
      this.error = 'Failed to load wishlist items.';
      this.loading = false;
    }
  });
}


}
