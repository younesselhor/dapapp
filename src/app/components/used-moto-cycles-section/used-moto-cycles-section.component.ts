// import { CommonModule } from '@angular/common';
// // import { Component } from '@angular/core';
// import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';


// interface Motorcycle {
//   id: number;
//   title: string;
//   price: number;
//   currency: string;
//   // imageUrl: string;
//   images: string[];
//   minimum_bid: number
// }
// @Component({
//   selector: 'app-used-moto-cycles-section',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './used-moto-cycles-section.component.html',
//   styleUrl: './used-moto-cycles-section.component.css'
// })
// export class UsedMotoCyclesSectionComponent implements OnInit {
//   // @ViewChild('motoSection') motoSection!: ElementRef;
//    currentSlide = 0;
//   // totalSlides = 3; // Update this based on your data
//   touchStartX = 0;
//   touchEndX = 0;



//   itemsPerSlide = 3;
//   motorcycles: Motorcycle[] = [
//     // {
//     //   id: 1,
//     //   title: 'Honda Shadow - Aero 2006',
//     //   price: 55000,
//     //   currency: 'SAR',
//     //   imageUrl: '/pictures/moto.png'
//     // },
//     // {
//     //   id: 2,
//     //   title: 'Honda Shadow - Aero 2006',
//     //   price: 55000,
//     //   currency: 'SAR',
//     //   imageUrl: '/pictures/moto.png'
//     // },
//     // {
//     //   id: 3,
//     //   title: 'Honda Shadow - Aero 2006',
//     //   price: 55000,
//     //   currency: 'SAR',
//     //   imageUrl: '/pictures/moto.png'
//     // },
//   ];

//   constructor(private listings : ListingByCatService, private router : Router) {}
//   ngOnInit(): void {
// this.getMotoresycles();
//   }
//   getMotoresycles() {
//     this.listings.getMotorcyclesByCategory().subscribe((res: any) => {
//       console.log('res', res);
//       this.motorcycles = res;
//       console.log('this.motorcycles: ', this.motorcycles);
//     });
//    }

//    get visibleMotorcycles() {
//     const start = this.currentSlide * this.itemsPerSlide;
//     return this.motorcycles.slice(start, start + this.itemsPerSlide);
//   }

//       viewListing(id: number): void {
//   this.router.navigate(['/listing', id]);
//   console.log('click');
// }

// //slide logic start 

//  // Existing methods
//   nextSlide() {
//     if (this.currentSlide < this.totalSlides - 1) {
//       this.currentSlide++;
//     }
//   }

//   prevSlide() {
//     if (this.currentSlide > 0) {
//       this.currentSlide--;
//     }
//   }

//   // New swipe gesture methods
//   @HostListener('touchstart', ['$event'])
//   onTouchStart(event: TouchEvent) {
//     this.touchStartX = event.changedTouches[0].screenX;
//   }

//   @HostListener('touchend', ['$event'])
//   onTouchEnd(event: TouchEvent) {
//     this.touchEndX = event.changedTouches[0].screenX;
//     this.handleSwipe();
//   }

//   private handleSwipe() {
//     const minSwipeDistance = 50; // Minimum distance to consider it a swipe
    
//     if (this.touchStartX - this.touchEndX > minSwipeDistance) {
//       // Swipe left (next slide)
//       this.nextSlide();
//     }

//     if (this.touchEndX - this.touchStartX > minSwipeDistance) {
//       // Swipe right (previous slide)
//       this.prevSlide();
//     }
//   }



// //slide logic end
//   // nextSlide() {
//   //   const maxSlides = Math.ceil(this.motorcycles.length / this.itemsPerSlide) - 1;
//   //   if (this.currentSlide < maxSlides) {
//   //     this.currentSlide++;
//   //   }
//   // }

//   // prevSlide() {
//   //   if (this.currentSlide > 0) {
//   //     this.currentSlide--;
//   //   }
//   // }

//   get totalSlides() {
//     return Math.ceil(this.motorcycles.length / this.itemsPerSlide);
//   }
//   }


import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';
import { LocationSService } from '../../services/location-s.service';
import { TranslateModule } from '@ngx-translate/core';

interface Motorcycle {
  id: number;
  title: string;
  price: number;
  currency: string;
  images: string[];
  minimum_bid: number;
}

@Component({
  selector: 'app-used-moto-cycles-section',
  standalone: true,
  imports: [CommonModule, RouterModule,TranslateModule],
  templateUrl: './used-moto-cycles-section.component.html',
  styleUrls: ['./used-moto-cycles-section.component.css']
})
export class UsedMotoCyclesSectionComponent {
  // currentPosition = 0;
  // cardWidth = 100; // Should match your card width + gap in CSS
  touchStartX = 0;
  // isDragging = false;
  // startPosition = 0;
  containerWidth = 1024; // Width of visible container area
  itemsPerSlide = 3;
  motorcycles: Motorcycle[] = [];
  currentPosition = 0;
  isDragging = false;
  startX = 0;
  startPosition = 0;
  cardWidth = 324; // Desktop card width
  mobileCardWidth = 300; // Mobile card width
  isMobile = false;
  countryname?: string;

  constructor(private listings: ListingByCatService, private router: Router,private locationService: LocationSService) {}

  ngOnInit(): void {
      this.locationService.selectedCountry$.subscribe((country) => {
    if (country?.name) {
      this.countryname = country.name;
      this.getMotorcycles();
    }
  });
     this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

searchedCountryMessage: string | null = null;

getMotorcycles() {
  if (!this.countryname) return;
  this.listings.getMotorcyclesByCategory(this.countryname).subscribe((res: any) => {
    this.motorcycles = res.listings || [];
    if (res.showing_all_countries && res.searched_country) {
      this.searchedCountryMessage = `No listings found for "${res.searched_country}". Showing all countries instead.`;
    } else {
      this.searchedCountryMessage = null;
    }
  });
}


  get visibleMotorcycles() {
    return this.motorcycles;
  }

  viewListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }
 // Width of each card including margin
  //   currentPosition = 0;
  // cardWidth = 324;
  // isDragging = false;
  // startX = 0;
  // startPosition = 0;


  // Calculate max scroll position
  get maxPosition() {
    return -((this.motorcycles.length * this.cardWidth) - this.containerWidth);
  }



  checkMobile() {
    this.isMobile = window.innerWidth < 768;
    this.currentPosition = 0; // Reset position on resize
  }

  getCardWidth() {
    return this.isMobile ? this.mobileCardWidth : this.cardWidth;
  }

  getVisibleCards() {
    return this.isMobile ? 1 : 3;
  }

  getMaxPosition() {
    const cardWidth = this.getCardWidth();
    const visibleCards = this.getVisibleCards();
    return -((this.motorcycles.length - visibleCards) * cardWidth);
  }

  startDrag(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = this.getX(event);
    this.startPosition = this.currentPosition;
    event.preventDefault();
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const x = this.getX(event);
    const dragDistance = x - this.startX;
    this.currentPosition = this.startPosition + dragDistance;
    
    // Constrain to boundaries
    const maxPosition = this.getMaxPosition();
    if (this.currentPosition > 0) this.currentPosition = 0;
    if (this.currentPosition < maxPosition) this.currentPosition = maxPosition;
  }

  endDrag() {
    this.isDragging = false;
    // Snap to nearest card
    const cardWidth = this.getCardWidth();
    this.currentPosition = Math.round(this.currentPosition / cardWidth) * cardWidth;
  }

  private getX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }
}



  // Handle mouse/touch start
  // startDrag(event: MouseEvent | TouchEvent) {
  //   this.isDragging = true;
  //   this.startX = this.getX(event);
  //   this.startPosition = this.currentPosition;
  //   event.preventDefault();
  // }

  // // Handle dragging
  // onDrag(event: MouseEvent | TouchEvent) {
  //   if (!this.isDragging) return;
  //   const x = this.getX(event);
  //   const dragDistance = x - this.startX;
  //   this.currentPosition = this.startPosition + dragDistance;
    
  //   // Constrain to boundaries
  //   if (this.currentPosition > 0) this.currentPosition = 0;
  //   if (this.currentPosition < this.maxPosition) this.currentPosition = this.maxPosition;
  // }

  // // Handle drag end
  // endDrag() {
  //   this.isDragging = false;
  // }

  // // Helper to get x position from both mouse and touch events
  // private getX(event: MouseEvent | TouchEvent): number {
  //   return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  // }

  // Prevent image drag
  // @HostListener('document:dragstart', ['$event'])
  // onDragStart(event: DragEvent) {
  //   if (event.target instanceof HTMLImageElement) {
  //     event.preventDefault();
  //   }
  // }

  // Touch events
  // @HostListener('touchstart', ['$event'])
  // onTouchStart(e: TouchEvent) {
  //   this.touchStartX = e.touches[0].clientX;
  //   this.startPosition = this.currentPosition;
  //   this.isDragging = true;
  // }

  // @HostListener('touchend', ['$event'])
  // onTouchEnd(e: TouchEvent) {
  //   if (!this.isDragging) return;
  //   this.isDragging = false;
  //   this.handleSwipe(e.changedTouches[0].clientX);
  // }

  // // Mouse events for desktop
  // @HostListener('mousedown', ['$event'])
  // onMouseDown(e: MouseEvent) {
  //   this.touchStartX = e.clientX;
  //   this.startPosition = this.currentPosition;
  //   this.isDragging = true;
  //   e.preventDefault(); // Prevent text selection
  // }

  // @HostListener('document:mouseup', ['$event'])
  // onMouseUp(e: MouseEvent) {
  //   if (!this.isDragging) return;
  //   this.isDragging = false;
  //   this.handleSwipe(e.clientX);
  // }

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(e: MouseEvent) {
  //   if (!this.isDragging) return;
  //   const delta = e.clientX - this.touchStartX;
  //   this.currentPosition = this.startPosition + delta;
  // }

  // private handleSwipe(endX: number) {
  //   const delta = endX - this.touchStartX;
  //   const threshold = 50; // Minimum swipe distance
    
  //   if (Math.abs(delta) < threshold) {
  //     this.currentPosition = this.startPosition;
  //     return;
  //   }

  //   if (delta > 0) {
  //     // Swipe right - previous
  //     this.currentPosition = Math.min(0, this.currentPosition + this.cardWidth);
  //   } else {
  //     // Swipe left - next
  //     const minPosition = -((this.motorcycles.length - this.itemsPerSlide) * this.cardWidth);
  //     this.currentPosition = Math.max(minPosition, this.currentPosition - this.cardWidth);
  //   }
  // }


  
  // getMotoresycles() {
  //   this.listings.getMotorcyclesByCategory().subscribe((res: any) => {
  //     this.motorcycles = res;
  //   });
  // }
  
// getMotorcycles() {
//   if (!this.countryId) return;

//   this.listings.getMotorcyclesByCategory(this.countryId).subscribe((res: any) => {
//     this.motorcycles = res as Motorcycle[];
//     console.log(' this.motorcycles : ',  this.motorcycles );
//   });
// }
