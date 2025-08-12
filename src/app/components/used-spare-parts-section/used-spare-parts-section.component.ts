import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { LocationSService } from '../../services/location-s.service';
import { TranslateModule } from '@ngx-translate/core';

interface SparePart {
  id: number;
  title: string;
  price: string; // Changed from number to string since API returns string
  currency?: string; // Make optional since API doesn't return this
  images: string[]; // Changed from imageUrl to images array
  description?: string;
  created_at?: string;
  city?: string;
  country?: string | null;
  wishlist?: boolean;
}

@Component({
  selector: 'app-used-spare-parts-section',
  standalone: true,
  imports: [CommonModule, RouterModule,TranslateModule],
  templateUrl: './used-spare-parts-section.component.html',
  styleUrls: ['./used-spare-parts-section.component.css'],

})
export class UsedSparePartsSectionComponent implements OnInit {
  currentSlide = 0;
  itemsPerSlide = 3;
  spareParts: SparePart[] = [];
  slideDirection: 'left' | 'right' = 'right';
  touchStartX = 0;
  // isDragging = false;
  // startPosition = 0;
  containerWidth = 1024; // Width of visible container area
  // itemsPerSlide = 3;
  // motorcycles: Motorcycle[] = [];
  currentPosition = 0;
  isDragging = false;
  startX = 0;
  startPosition = 0;
  cardWidth = 324; // Desktop card width
  mobileCardWidth = 300; // Mobile card width
  isMobile = false;
    countryname?: string;
  constructor(private listinbyCat: ListingByCatService, private router : Router, private locationService: LocationSService) {}

  ngOnInit(): void {


    this.locationService.selectedCountry$.subscribe((country) => {
    if (country?.name) {
      this.countryname = country.name;
      this.getBikePart();
    }else{
      this.countryname = 'all'; // Default to 'all' if no country is selected
      this.getBikePart();
    }
  });
  }


   truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  // getBikePart() {
  //   if (!this.countryId) return;
  //   this.listinbyCat.getBikePartByCategory(this.countryId).subscribe((res: any) => {
  //     this.spareParts = res;
  //     console.log('this.spareParts: ', this.spareParts);
  //   });
  // }
  searchedCountryMessage: string | null = null;

  getBikePart() {
  if (!this.countryname) return;

  this.listinbyCat.getBikePartByCategory(this.countryname).subscribe((res: any) => {
    this.spareParts = res.listings || [];

    if (res.showing_all_countries && res.searched_country) {
      this.searchedCountryMessage = `No listings found for "${res.searched_country}". Showing all countries instead.`;
    } else {
      this.searchedCountryMessage = null;
    }
  });
}
  get visibleParts() {
    const start = this.currentSlide * this.itemsPerSlide;
    return this.spareParts.slice(start, start + this.itemsPerSlide);
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.slideDirection = 'right';
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.slideDirection = 'left';
      this.currentSlide--;
    }
  }

  goToSlide(index: number) {
    this.slideDirection = index > this.currentSlide ? 'right' : 'left';
    this.currentSlide = index;
  }

    viewListing(id: number): void {
  this.router.navigate(['/listing', id]);
}

  get totalSlides() {
    return Math.ceil(this.spareParts.length / this.itemsPerSlide);
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
    return -((this.spareParts.length - visibleCards) * cardWidth);
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