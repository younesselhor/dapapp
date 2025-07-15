import { Component, OnInit } from '@angular/core';
import { ListingService } from './listingProduct.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';



// Update your method



@Component({
  selector: 'app-main-products-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './main-products-page.component.html',
  styleUrl: './main-products-page.component.css',
  providers: [DatePipe]
})
export class MainProductsPageComponent implements OnInit {
  listing: any;
  listingId: any;
  loading = true;
  error: string | null = null;
  activeImageIndex = 0;
  isMotorcycle = false;
  isSparePart = false;
  lastsoom: number = 0;
  showSoomInfo: boolean = false;
  showModal = false;
  soomAmount: number | null = null;
  isSubmittingSoom: boolean = false;
  soomError: string | null = null;
  soomSuccess: boolean = false;
  minimumRequired: number | null = null;
  confirmSoomStep = false;



  constructor(
    private listingService: ListingService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private auth :AuthService
  ) { }

  ngOnInit(): void {
    // this.loadListing();
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convert string to number
      if (id) {
        this.loadListing(id);
        this.lastSoom(id)
      }
    });
  }

  loadListing(id: number): void {
    this.listingService.getListing(id).subscribe({ // Change ID as needed
      next: (data) => {
        this.listingId = data.id
        this.listing = data;
        console.log('this.listing: ', this.listing);
        this.isMotorcycle = !!data.motorcycle;
        this.isSparePart = !!data.spare_part;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load listing';
        this.loading = false;
        console.error(err);
      }
    });

  }

  lastSoom(id:number){
    this.listingService.lastSoom(id).subscribe({
       next: (response: any) => {
      this.lastsoom = response.data.min_soom || null; // Access the nested amount
    }
    })
  }


//   toggleWishlist(listingId: number): void {
//   this.listingService.toggleWishlist(listingId).subscribe({
//     next: () => {
//       // Force refresh the user profile to get updated wishlist
//       this.auth.fetchUserProfile();
//     },
//     error: (err) => {
//       console.error('Error toggling wishlist:', err);
//       // Optionally show error message
//     }
//   });
// }

  toggleWishlist(): void {
    // const previousState = this.listing.wishlist;

    // // Optimistic UI update
    // this.listing.wishlist = !previousState;

    this.listingService.toggleWishlist(this.listingId).subscribe({
      next: ()=>{
        // this.auth.fetchUserProfileOnce();
      },
      error: () => {
        // Revert on error
        // this.listing.wishlist = previousState;
        // this.toastr.error('Failed to update wishlist'); // Optional
      }
    });
  }
  // loadListing(): void {
  //   this.listingService.getListing(42).subscribe({ // Change ID as needed
  //     next: (data) => {
  //       this.listing = data;
  //       this.isMotorcycle = !!data.motorcycle;
  //       this.isSparePart = !!data.spare_part;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Failed to load listing';
  //       this.loading = false;
  //       console.error(err);
  //     }
  //   });
  // }



  // openModal() {
  //   console.log('clicked');
  //   this.showModal = true;
  //   // document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  // }

  // submitSoom(): void {
  //   if (this.soomAmount && this.soomAmount >= this.listing?.submission?.amount) {
  //     // Handle soom submission logic here
  //     console.log('Submitting soom with amount:', this.soomAmount);

  //     // Close modal after submission
  //     this.closeModal();

  //     // You can add your API call here to submit the soom
  //     // this.soomService.submitSoom(this.listing.id, this.soomAmount);
  //   }
  // }
//   toggleWishlist(): void {
//   // Optimistic UI update - toggle the state immediately
//   const previousState = this.listing.wishlist;
//   this.listing.wishlist = !previousState;

//   this.listingService.toggleWishlist(this.listingId).subscribe({
//     next: () => {
//       // Success - refresh user profile
//       this.auth.fetchUserProfileOnce();
//     },
//     error: () => {
//       // Revert on error
//       this.listing.wishlist = previousState;
//       // this.toastr.error('Failed to update wishlist'); // Optional
//     }
//   });
// }

  scrollToTop() {
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth'
    // });
    this.showSoomInfo = !this.showSoomInfo;

  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  formatMemberSince(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'MMM yyyy') || '';
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  getTitle(): string {
    if (this.isMotorcycle) {
      return `${this.listing.motorcycle.brand} ${this.listing.motorcycle.model} ${this.listing.motorcycle.year}`;
    } else if (this.isSparePart) {
      return `${this.listing.spare_part.bike_part_brand} ${this.listing.spare_part.bike_part_category}`;
    }
    return this.listing.title;
  }


  toggleSoomInfo() {
    this.showSoomInfo = !this.showSoomInfo;
  }
  openModal(): void {
    this.showModal = true;
    this.soomAmount = this.lastsoom;
  }
  closeModal() {
    this.showModal = false;
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  isSoomAmountValid(): boolean {
    // const baseMinimum = this.minimumRequired ?? this.listing?.submission?.amount ?? 0;
    const baseMinimum = this.minimumRequired ?? this.lastsoom ?? 0;
    return this.soomAmount !== null && this.soomAmount >= baseMinimum;
  }

  // submitSoom(): void {
  //   const baseMinimum = this.minimumRequired ?? this.listing?.submission?.amount ?? 0;

  //   if (!this.soomAmount || this.soomAmount < baseMinimum) {
  //     this.soomError = 'Please enter a valid amount above the minimum.';
  //     return;
  //   }

  //   if (!this.listing?.id) {
  //     this.soomError = 'Listing information is not available.';
  //     return;
  //   }

  //   this.isSubmittingSoom = true;
  //   this.soomError = null;

  //   this.listingService.submitSoom(this.listing.id, this.soomAmount).subscribe({
  //     next: (response) => {
  //       console.log('Soom submitted successfully:', response);
  //       this.isSubmittingSoom = false;
  //       this.lastsoom = response.data.min_soom

  //       this.minimumRequired = response.data.min_soom ;

  //       setTimeout(() => {
  //         this.closeModal();
  //       }, 2000);
  //     },
  //     error: (error) => {
  //       console.error('Error submitting soom:', error);
  //       this.isSubmittingSoom = false;

  //       if (error.status === 422 && error.error?.minimum_required) {
  //         this.minimumRequired = error.error.minimum_required;
  //         this.soomError = `The current highest soom is SAR ${error.error.current_highest}. You must offer at least SAR ${this.minimumRequired}.`;
  //       } else if (error.status === 401) {
  //         this.soomError = 'You need to be logged in to submit a soom.';
  //       } else if (error.status === 403) {
  //         this.soomError = 'You are not authorized to submit a soom for this listing.';
  //       } else {
  //         this.soomError = 'Failed to submit soom. Please try again later.';
  //       }
  //     }
  //   });
  // }

  submitSoom(): void {
  const baseMinimum = this.lastsoom;

  if (!this.soomAmount || this.soomAmount < baseMinimum) {
    this.soomError = 'Please enter a valid amount above the minimum.';
    return;
  }

  // Check if amount is 10x or more
  if (this.soomAmount >= baseMinimum * 10) {
    console.log('this.soomAmount: ', this.soomAmount);
   
    this.confirmSoomStep = true;
    return; // Don't submit yet
  }

  this.performSoomSubmission(); // normal submission
}
performSoomSubmission(): void {
  if (!this.listing?.id) {
    this.soomError = 'Listing information is not available.';
    return;
  }

  if (this.soomAmount === null) {
    this.soomError = 'Soom amount is missing.';
    return;
  }

  this.isSubmittingSoom = true;
  this.soomError = null;
  this.listingService.submitSoom(this.listing.id, this.soomAmount).subscribe({
    next: (response) => {
      console.log('Soom submitted successfully:', response);
      this.isSubmittingSoom = false;
      this.lastsoom = response.data.min_soom || 0;
      this.minimumRequired = response.data.min_soom || null;
      this.soomSuccess = true;

      setTimeout(() => {
        this.closeModal();
      }, 2000);
    },
    error: (error) => {
      console.error('Error submitting soom:', error);
      this.isSubmittingSoom = false;

      if (error.status === 422 && error.error?.minimum_required) {
        this.minimumRequired = error.error.minimum_required;
        this.soomError = `The current highest soom is SAR ${error.error.current_highest}. You must offer at least SAR ${this.minimumRequired}.`;
      } else if (error.status === 401) {
        this.soomError = 'You need to be logged in to submit a soom.';
      } else if (error.status === 403) {
        this.soomError = 'You are not authorized to submit a soom for this listing.';
      } else {
        this.soomError = 'Failed to submit soom. Please try again later.';
      }
    }
  });
}

  // submitSoom(): void {
  //   if (!this.soomAmount || this.soomAmount < (this.listing?.submission?.amount || 0)) {
  //     this.soomError = 'Please enter a valid amount above the minimum.';
  //     return;
  //   }

  //   if (!this.listing?.id) {
  //     this.soomError = 'Listing information is not available.';
  //     return;
  //   }

  //   this.isSubmittingSoom = true;
  //   this.soomError = null;

  //   this.listingService.submitSoom(this.listing.id, this.soomAmount).subscribe({
  //     next: (response) => {
  //       console.log('Soom submitted successfully:', response);
  //       this.soomSuccess = true;
  //       this.isSubmittingSoom = false;

  //       // Show success message for 2 seconds then close modal
  //       setTimeout(() => {
  //         this.closeModal();
  //       }, 2000);
  //     },
  //     error: (error) => {
  //       console.error('Error submitting soom:', error);
  //       this.isSubmittingSoom = false;

  //       // Handle different error cases
  //       if (error.status === 400) {
  //         this.soomError = 'Invalid soom amount. Please check the minimum amount required.';
  //       } else if (error.status === 401) {
  //         this.soomError = 'You need to be logged in to submit a soom.';
  //       } else if (error.status === 403) {
  //         this.soomError = 'You are not authorized to submit a soom for this listing.';
  //       } else {
  //         this.soomError = 'Failed to submit soom. Please try again later.';
  //       }
  //     }
  //   });
  // }

  // Validation method




  // isSoomAmountValid(): boolean {
  //   return this.soomAmount !== null && 
  //          this.soomAmount >= (this.listing?.submission?.amount || 0);
  // }

}
