import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { LocationSService } from '../../services/location-s.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LoginModalComponent } from '../login-modal.component';

interface SparePart {
  id: number;
  title: string;
  price: number; // Changed from number to string since API returns string
  currency?: string; // Make optional since API doesn't return this
  images: string[]; // Changed from imageUrl to images array
  description?: string;
  created_at?: string;
  city?: string;
  country?: string | null;
  wishlist?: boolean;
  minimum_bid?: number;
}

@Component({
  selector: 'app-used-spare-parts-section',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoginModalComponent],
  templateUrl: './used-spare-parts-section.component.html',
  styleUrls: ['./used-spare-parts-section.component.css'],
})
export class UsedSparePartsSectionComponent implements OnInit {
  currentSlide = 0;
  itemsPerSlide = 3;
  spareParts: SparePart[] = [];
  slideDirection: 'left' | 'right' = 'right';
  touchStartX = 0;
  containerWidth = 1024; // Width of visible container area
  currentPosition = 0;
  isDragging = false;
  startX = 0;
  startPosition = 0;
  cardWidth = 324; // Desktop card width
  mobileCardWidth = 300; // Mobile card width
  isMobile = false;
  countryname?: string;
  showLoginModal = false;
  gap = 16;
    isLoggedIn = false;
      private sub: any;
  constructor(
    private listinbyCat: ListingByCatService,
    private router: Router,
    private locationService: LocationSService,
     private authService: AuthService
  ) {}

  ngOnInit(): void {

        this.sub = this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });


    this.locationService.selectedCountry$.subscribe((country) => {
      if (country?.name) {
        this.countryname = country.name;
        this.getBikePart();
      } else {
        this.countryname = 'all'; // Default to 'all' if no country is selected
        this.getBikePart();
      }
    });
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  searchedCountryMessage: string | null = null;

  getBikePart() {
    const countryToSearch = this.countryname || 'all';
    this.listinbyCat
      .getBikePartByCategory(countryToSearch)
      .subscribe((res: any) => {
        this.spareParts = res.listings || [];
        if (!this.countryname) {
          this.searchedCountryMessage = 'Showing all countries';
        } else if (res.showing_all_countries && res.searched_country) {
          this.searchedCountryMessage = `No listings found for "${res.searched_country}". Showing all countries instead.`;
        } else {
          this.searchedCountryMessage = null;
        }
      });
  }
  get visibleParts() {
    // const start = this.currentSlide * this.itemsPerSlide;
    // return this.spareParts.slice(start, start + this.itemsPerSlide);
    return this.spareParts;
  }

    viewListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }


  
  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  get shouldSlide(): boolean {
    return this.spareParts.length > 3;
  }

    checkMobile() {
    this.isMobile = window.innerWidth < 768;
    this.currentPosition = 0; // Reset position on resize
  }

  getVisibleCards() {
    return this.isMobile ? 1 : 3;
  }

  startDrag(event: MouseEvent | TouchEvent) {
    // Only allow dragging if there are more than 3 items
    if (!this.shouldSlide) return;

    this.isDragging = true;
    this.startX = this.getX(event);
    this.startPosition = this.currentPosition;
    event.preventDefault();
  }

  onDrag(event: MouseEvent | TouchEvent) {
    // Only allow dragging if there are more than 3 items
    if (!this.isDragging || !this.shouldSlide) return;

    const x = this.getX(event);
    const dragDistance = x - this.startX;

    const isRTL = document.dir === 'rtl';
    const adjustedDistance = isRTL ? -dragDistance : dragDistance;

    this.currentPosition = this.startPosition + adjustedDistance;

    const maxPosition = this.getMaxPosition();
    if (this.currentPosition > 0) this.currentPosition = 0;
    if (this.currentPosition < maxPosition) this.currentPosition = maxPosition;
  }


    getCardWidth() {
    const card = document.querySelector<HTMLElement>('.slider-card');
    return card ? card.offsetWidth : this.cardWidth; // fallback
  }

  
  getMaxPosition(): number {
    if (!this.shouldSlide || this.spareParts.length <= 0) return 0;

    const cardWidth = this.getCardWidth();
    const gap = this.gap;
    const visibleCards = this.getVisibleCards();

    // Calculate total width of all cards including gaps
    const totalWidth =
      this.spareParts.length * cardWidth + (this.spareParts.length - 1) * gap;

    // Calculate visible width (container width)
    // const containerWidth = this.getSliderContainerWidth();

    // If total width is less than container width, no need to scroll
    // if (totalWidth <= containerWidth) return 0;
    console.log('totalWidthtotalWidth', totalWidth - cardWidth);
    // Maximum position is the difference between total width and container width (negative)
    return -(totalWidth - cardWidth);
  }


  
  endDrag() {
    if (!this.shouldSlide) return;

    this.isDragging = false;
    const cardWidth = this.getCardWidth() + this.gap;
    this.currentPosition =
      Math.round(this.currentPosition / cardWidth) * cardWidth;

    const maxPosition = this.getMaxPosition();
    if (this.currentPosition > 0) this.currentPosition = 0;
    if (this.currentPosition < maxPosition) this.currentPosition = maxPosition;
  }

  
  private getX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.clientX
      : event.touches[0].clientX;
  }

  get totalSlides() {
    return Math.ceil(this.spareParts.length / this.itemsPerSlide);
  }




  






}
