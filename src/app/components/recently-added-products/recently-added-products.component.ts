import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';
import { Router } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../services/auth.service';


interface Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  type: 'motorcycle' | 'part' | 'plate';
}

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  category_id: number;
  images: string[];
  // Add other properties you need from the listing
}

interface RecentlyAddedResponse {
  message: string;
  searched_country: string | null;
  showing_all_countries: boolean;
  total_listings: number;
  listings: Listing[];
}
@Component({
  selector: 'app-recently-added-products',
  standalone: true,
  imports: [CommonModule,LoginModalComponent],
  templateUrl: './recently-added-products.component.html',
  styleUrl: './recently-added-products.component.css'
})
export class RecentlyAddedProductsComponent {
    currentSlide = 0;
  slidesToShow = 5;
  recentProducts: Product[] = [
    {
      id: 1,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 2,
      title: 'Honda Shadow - Aero 2006',
      price: 55000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 3,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondashadow.png',
      type: 'motorcycle'
    },
    {
      id: 4,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 5,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 6,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondashadow.png',
      type: 'motorcycle'
    },
    {
      id: 7,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 8,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 9,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 10,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 11,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 12,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    }
    // , {
    //   id: 13,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur2.png',
    //   type: 'motorcycle'
    // },
    // {
    //   id: 14,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur1.png',
    //   type: 'motorcycle'
    // }, {
    //   id: 15,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur2.png',
    //   type: 'motorcycle'
    // },
    // {
    //   id: 16,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur1.png',
    //   type: 'motorcycle'
    // }
  ];

  // Slider configuration
  // currentSlide: number = 0;
  // slidesToShow: number = 5;
  slidesToMove: number = 1;
  totalSlides: number = this.recentProducts.length;
  dotsArray: number[] = [];
    showLoginModal = false;
  isLoggedIn = false;
  private sub: any;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private listingbyService :ListingByCatService, private router: Router, private authService: AuthService) {}
  // Computed property for CSS transform
  get currentSlidePosition(): number {
    return (this.currentSlide * 100) / this.slidesToShow;
  }


  // updateSlidesToShow(): void {
  //   if (window.innerWidth < 640) {
  //     this.slidesToShow = 1;
  //     this.slidesToMove = 1;
  //   } else if (window.innerWidth < 768) {
  //     this.slidesToShow = 2;
  //     this.slidesToMove = 2;
  //   } else if (window.innerWidth < 1024) {
  //     this.slidesToShow = 3;
  //     this.slidesToMove = 3;
  //   } else {
  //     this.slidesToShow = 5;
  //     this.slidesToMove = 5;
  //   }
  // }

  updateSlidesToShow(): void {
    if (isPlatformBrowser(this.platformId)) {
  if (window.innerWidth < 640) {
    this.slidesToShow = 1;
    this.slidesToMove = 1;
  } else if (window.innerWidth < 768) {
    this.slidesToShow = 3; // Show 3 so you can see side items
    this.slidesToMove = 1;
  } else if (window.innerWidth < 1024) {
    this.slidesToShow = 5; // Show 5 so you can see 2 on each side
    this.slidesToMove = 1;
  } else {
    this.slidesToShow = 5;
    this.slidesToMove = 1;
  }
}
}

shouldReduceOpacity(index: number): boolean {
  const visibleStart = this.currentSlide;
  const centerIndex = visibleStart + 2; // The center item (0-indexed, so position 2 is the middle)
  
  // Items at positions 0, 1 (left side) and 3, 4 (right side) should have reduced opacity
  return index === visibleStart || index === visibleStart + 1 || 
         index === visibleStart + 3 || index === visibleStart + 4;
}
  // updateDotsArray(): void {
  //   const dotsCount = Math.ceil((this.totalSlides - this.slidesToShow + 1) / this.slidesToMove);
  //   this.dotsArray = Array(dotsCount).fill(0).map((_, i) => i);
  // }
  ngOnInit(): void {
        this.sub = this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    // this.updateSlidesToShow();
    // this.updateDotsArray();

    // // Handle resize event to make slider responsive
    // window.addEventListener('resize', () => {
    //   this.updateSlidesToShow();
    //   this.updateDotsArray();
    //   // Make sure current slide is valid after resizing
    //   if (this.currentSlide > this.totalSlides - this.slidesToShow) {
    //     this.currentSlide = Math.max(0, this.totalSlides - this.slidesToShow);
    //   }
    // });
    if (isPlatformBrowser(this.platformId)) {
      this.updateSlidesToShow();
      this.updateDotsArray();

      //  if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => {
        this.updateSlidesToShow();
        this.updateDotsArray();
        if (this.currentSlide > this.totalSlides - this.slidesToShow) {
          this.currentSlide = Math.max(0, this.totalSlides - this.slidesToShow);
        }
      });
    // }
  }
  this.recentlyadd();
  }

   viewListing(id: number): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/listing', id]);
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }
  // recentlyadd(){
  //   this.listingbyService.getRecentlyAdd().subscribe((data) => {
  //     console.log('data recent ',data);
  //   });
  // }
//   recentlyadd() {
//   this.listingbyService.getRecentlyAdd().subscribe((data) => {
//     console.log('data recent ', data);
    
//     // Map the API response to your Product interface format
//     this.recentProducts = data.listings.map((listing: any) => {
//       // Determine the image URL - using first image if available, otherwise a placeholder
//       const imageUrl = listing.images && listing.images.length > 0 
//         ? listing.images[0] 
//         : '/pictures/placeholder.png'; // You should have a placeholder image
    
//       return {
//         id: listing.id,
//         title: listing.title,
//         price: parseFloat(listing.price),
//         currency: 'SAR', // Assuming SAR as default currency
//         imageUrl: imageUrl,
//         type: this.getProductType(listing.category_id)
//       };
//     });

//     // Update slider calculations after data is loaded
//     this.totalSlides = this.recentProducts.length;
//     this.updateDotsArray();
//   });
// }
recentlyadd() {
  // this.listingbyService.getRecentlyAdd().subscribe((data) => {
  //   console.log('data recent ', data);
    
  //   if (data && data.listings) {
  //     // Map the API response to your Product interface format
  //     this.recentProducts = data.listings.map((listing: Listing) => {
  //       // Determine the image URL - using first image if available, otherwise a placeholder
  //       const imageUrl = listing.images && listing.images.length > 0 
  //         ? listing.images[0] 
  //         : '/pictures/placeholder.png';
        
  //       return {
  //         id: listing.id,
  //         title: listing.title,
  //         price: parseFloat(listing.price),
  //         currency: 'SAR',
  //         imageUrl: imageUrl,
  //         type: this.getProductType(listing.category_id)
  //       };
  //     });

  //     // Update slider calculations after data is loaded
  //     this.totalSlides = this.recentProducts.length;
  //     this.updateDotsArray();
  //   }
  // });
this.listingbyService.getRecentlyAdd().subscribe((data: any) => {
    const response = data as RecentlyAddedResponse;
   
    if (response && response.listings) {
      this.recentProducts = response.listings.map((listing: Listing) => {
        // / Determine the image URL - using first image if available, otherwise a placeholder
        const imageUrl = listing.images && listing.images.length > 0 
          ? listing.images[0] 
          : '/pictures/moto.png'; // You should have a placeholder image
        
        return {
          id: listing.id,
          title: listing.title,
          price: parseFloat(listing.price),
          currency: 'SAR',
          imageUrl: imageUrl,
          type: this.getProductType(listing.category_id)
        };
      });
         // Update slider calculations after data is loaded
      this.totalSlides = this.recentProducts.length;
      this.updateDotsArray();
    }
    
  });
}

private getProductType(categoryId: number): 'motorcycle' | 'part' | 'plate' {
  // Adjust these mappings based on your actual category IDs
  switch(categoryId) {
    case 1: return 'motorcycle';
    case 2: return 'part';
    case 3: return 'plate';
    default: return 'motorcycle'; // default fallback
  }
}
  // viewListing(id: number): void {
  //   this.router.navigate(['/listing', id]);
  //   console.log('click');
  //   console.log('id',id);
  // }
//   viewListing(id: number): void {
//   if (!id || isNaN(id)) {
//     console.error('Invalid ID:', id);
//     return;
//   }
//   this.router.navigate(['/listing', id]);
// }
  // updateSlidesToShow(): void {
  //   if (window.innerWidth < 640) {
  //     this.slidesToShow = 1;
  //     this.slidesToMove = 1;
  //   } else if (window.innerWidth < 768) {
  //     this.slidesToShow = 2;
  //     this.slidesToMove = 2;
  //   } else if (window.innerWidth < 1024) {
  //     this.slidesToShow = 3;
  //     this.slidesToMove = 3;
  //   } else {
  //     this.slidesToShow = 5;
  //     this.slidesToMove = 5;
  //   }
  // }

  // updateDotsArray(): void {
  //   const dotsCount = Math.ceil((this.totalSlides - this.slidesToShow + 1) / this.slidesToMove);
  //   this.dotsArray = Array(dotsCount).fill(0).map((_, i) => i);
  // }

  // nextSlide(): void {
  //   if (this.currentSlide < this.totalSlides - this.slidesToShow) {
  //     this.currentSlide += this.slidesToMove;
  //     // Don't exceed total slides
  //     if (this.currentSlide > this.totalSlides - this.slidesToShow) {
  //       this.currentSlide = this.totalSlides - this.slidesToShow;
  //     }
  //   }
  // }

  // prevSlide(): void {
  //   if (this.currentSlide > 0) {
  //     this.currentSlide -= this.slidesToMove;
  //     // Don't go below 0
  //     if (this.currentSlide < 0) {
  //       this.currentSlide = 0;
  //     }
  //   }
  // }

  // goToSlide(index: number): void {
  //   this.currentSlide = index * this.slidesToMove;
  //   // Ensure we don't exceed boundaries
  //   if (this.currentSlide > this.totalSlides - this.slidesToShow) {
  //     this.currentSlide = this.totalSlides - this.slidesToShow;
  //   }
  // }




  
  // get currentDotIndex() {
  //   return Math.floor(this.currentSlide / this.slidesToShow);
  // }
  
  // get totalSlides() {
  //   return this.recentProducts.length;
  // }
  
  // get dotsArray() {
  //   return Array(Math.ceil(this.totalSlides / this.slidesToShow)).fill(0);
  // }
  
  getVisibleProducts() {
    return this.recentProducts.slice(this.currentSlide, this.currentSlide + this.slidesToShow);
  }
  
  // nextSlide() {
  //   if (this.currentSlide < this.totalSlides - this.slidesToShow) {
  //     this.currentSlide += this.slidesToShow;
  //   }
  // }
  
  // prevSlide() {
  //   if (this.currentSlide > 0) {
  //     this.currentSlide -= this.slidesToShow;
  //   }
  // }
  
  // goToSlide(index: number) {
  //   this.currentSlide = index * this.slidesToShow;
  // }



  nextSlide() {
  if (this.currentSlide < this.totalSlides - this.slidesToShow) {
    this.currentSlide += 1; // Move one item
  }
}

prevSlide() {
  if (this.currentSlide > 0) {
    this.currentSlide -= 1; // Move one item
  }
}

// Update goToSlide
goToSlide(index: number) {
  this.currentSlide = index;
  if (this.currentSlide > this.totalSlides - this.slidesToShow) {
    this.currentSlide = this.totalSlides - this.slidesToShow;
  }
}

// Update currentDotIndex
get currentDotIndex() {
  return this.currentSlide;
}

// Update updateDotsArray
updateDotsArray(): void {
  const dotsCount = this.totalSlides - this.slidesToShow + 1;
  this.dotsArray = Array(dotsCount).fill(0).map((_, i) => i);
}
}
