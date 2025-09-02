import { Component, HostListener, OnInit } from '@angular/core';
import { ListingService } from './listingProduct.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';



// Update your method

interface Plate {
  id: number;
  title: string;
  price: string;
  city: string;
  license_plate?: {
    plate_format: {
      country: {
        name: string;
        code: string;
      };
    };
    fields: {
      field_name: string;
      field_position:string;
      value: string;
      position?: string;
    }[];
  };
  auction_enabled?: number;
  minimum_bid?: string;
}

interface PlateField {
  field_id: number;
  field_name: string;
  field_type: string | null;
  field_label: string | null;
  is_required: boolean;
  max_length: number;
  validation_pattern: string | null;
  value: string;
}
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
  isModalOpen = false;


  allPositions: string[] = [
  'top-left', 'top-center', 'top-right',
  'left-center', 'center', 'right-center',
  'bottom-left', 'bottom-center', 'bottom-right'
];

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

  getPlateBackgroundClass(plate: any): string {
  const countryCode = plate.license_plate?.plate_format?.country?.code;
  
  switch(countryCode) {
    case 'AE': // UAE
      return 'uae-bg';
    case 'SA': // Saudi Arabia
      return 'saudi-bg';
    case 'KW': // Kuwait
      return 'kuwait-bg';
    default:
      return 'default-bg';
  }
}

// getPlateFieldMap(plate: Plate): { [position: string]: string } {
//   const map: { [key: string]: string } = {};
//   plate.license_plate?.fields?.forEach(field => {
//     if (field.field_position && field.value) {
//       map[field.field_position] = field.value;
//     }
//   });
//   return map;
// }

  getCountryName(plate: Plate): string {
    return plate.license_plate?.plate_format.country.name || '';
  }

  getPositionClass(pos: string): string {
  const base = 'text-center';
  const map: { [key: string]: string } = {
    'top-left': 'top-1 left-1',
    'top-center': 'top-1 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-1 right-1',
    'left-center': 'left-1 top-1/2 transform -translate-y-1/2',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'right-center': 'right-1 top-1/2 transform -translate-y-1/2',
    'bottom-left': 'bottom-1 left-1',
    'bottom-center': 'bottom-1 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-1 right-1'
  };
  return `${base} ${map[pos] || ''}`;
}
getSidebarClass(plate: Plate): string {
  const code = plate.license_plate?.plate_format?.country?.code;
  switch (code) {
    case 'KW':
      return 'bg-[#d32f2f]'; // Red
    case 'AE':
      return 'bg-[#6b21a8]'; // Purple
    default:
      return 'bg-[#138c36]'; // KSA green fallback
  }
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

getSaudiPlateParts(plate: any): {
  arLetters: string,
  arNumbers: string,
  enLetters: string,
  enNumbers: string
} | null {
  const fields: PlateField[] = plate?.license_plate?.fields;
  if (!fields || fields.length < 4) return null;

  const arLetters = fields.find((f: PlateField) =>
    f.field_name.toLowerCase().includes('letter') &&
    f.field_name.toLowerCase().includes('arabic')
  )?.value || '';

  const arNumbers = fields.find((f: PlateField) =>
    f.field_name.toLowerCase().includes('number') &&
    f.field_name.toLowerCase().includes('arabic')
  )?.value || '';

  const enLetters = fields.find((f: PlateField) =>
    f.field_name.toLowerCase().includes('letter') &&
    f.field_name.toLowerCase().includes('english')
  )?.value || '';

  const enNumbers = fields.find((f: PlateField) =>
    f.field_name.toLowerCase().includes('number') &&
    f.field_name.toLowerCase().includes('english')
  )?.value || '';

  return { arLetters, arNumbers, enLetters, enNumbers };
}


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

  // setActiveImage(index: number): void {
  //   this.activeImageIndex = index;
  // }

  setActiveImage(index: number): void {
  this.activeImageIndex = index;
  this.isModalOpen = true;
}

openModalImages(index: number): void {
  this.activeImageIndex = index;
  this.isModalOpen = true;
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}


// closeModalImages(): void {
//   this.isModalOpen = false;
// }

closeModalImages(): void {
  this.isModalOpen = false;
  // Re-enable body scrolling
  document.body.style.overflow = 'auto';
}

prevImage(): void {
  if (this.listing?.images?.length > 0) {
    this.activeImageIndex =
      (this.activeImageIndex - 1 + this.listing.images.length) %
      this.listing.images.length;
  }
}

nextImage(): void {
  if (this.listing?.images?.length > 0) {
    this.activeImageIndex =
      (this.activeImageIndex + 1) % this.listing.images.length;
  }
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

  submitSoom(): void {
  const baseMinimum = this.lastsoom;

  if (!this.soomAmount || this.soomAmount < baseMinimum) {
    this.soomError = 'Please enter a valid amount above the minimum.';
    return;
  }

  // Check if amount is 10x or more
  if (this.soomAmount >= baseMinimum * 10) {
   
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

getPlateFieldMap(plate: Plate): { [position: string]: string } {
  const map: { [key: string]: string } = {};
  if (!plate.license_plate?.fields) return map;
  
  plate.license_plate.fields.forEach(field => {
    // Normalize position names to match your template
    const normalizedPosition = field.position?.toLowerCase().replace(' ', '-') || '';
    if (normalizedPosition && field.value) {
      map[normalizedPosition] = field.value;
    }
  });
  return map;
}

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  if (this.isModalOpen) {
    if (event.key === 'Escape') {
      this.closeModalImages();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevImage();
    }
  }
}
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


