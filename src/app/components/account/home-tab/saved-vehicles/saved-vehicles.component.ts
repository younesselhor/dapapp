import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Listing } from '../../../../interfaces/user-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../main-products-page/listingProduct.service';
// import { ListingService } from '../../../postingAdd/product-form/listingService/listing-service.service';

@Component({
  selector: 'app-saved-vehicles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-vehicles.component.html',
  styleUrl: './saved-vehicles.component.css'
})
export class SavedVehiclesComponent implements OnInit {
  listingarray: Listing[] = [];
  loading = true;
  error = '';

  constructor(
    private auth: AuthService,
    private listingService: ListingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getwishlist();
  }

  /**
   * Fetch wishlist items
   */
  getwishlist(): void {
    this.loading = true;
    this.error = '';
    
    this.listingService.getWishlists().subscribe({
      next: (res) => {
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

  /**
   * Handle image loading errors
   */
  onImageError(event: any): void {
    event.target.src = '/pictures/hondablur1.png';
  }

  /**
   * Remove item from wishlist
   * @param listingId - The listing ID to remove
   * @param event - Click event to prevent propagation
   */
  removeFromWishlist(listingId: number, event: Event): void {
    // Prevent card click event from firing
    event.stopPropagation();

    // Optimistically remove from UI
    const originalArray = [...this.listingarray];
    this.listingarray = this.listingarray.filter(item => item.id !== listingId);

    this.listingService.removeFromWishlist(listingId).subscribe({
      next: () => {
        console.log('Removed from wishlist successfully');
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        // Revert on error
        this.listingarray = originalArray;
        this.error = 'Failed to remove item from wishlist. Please try again.';
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }

  /**
   * Navigate to listing details page
   * @param id - The listing ID
   */
  viewListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }
}