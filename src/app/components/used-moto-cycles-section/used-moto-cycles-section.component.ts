import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';
import { LocationSService } from '../../services/location-s.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LoginModalComponent } from '../login-modal.component';

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
  imports: [CommonModule, RouterModule, TranslateModule,LoginModalComponent],
  templateUrl: './used-moto-cycles-section.component.html',
  styleUrls: ['./used-moto-cycles-section.component.css']
})
export class UsedMotoCyclesSectionComponent {
  touchStartX = 0;
  containerWidth = 1024;
  itemsPerSlide = 3;
  motorcycles: Motorcycle[] = [];
  currentPosition = 0;
  isDragging = false;
  startX = 0;
  startPosition = 0;
  cardWidth = 324;
  mobileCardWidth = 300;
  isMobile = false;
  countryname?: string;
  searchedCountryMessage: string | null = null;
    showLoginModal = false;
  isLoggedIn = false;


    private sub: any;

  constructor(
    private listings: ListingByCatService, 
    private router: Router,
    private locationService: LocationSService,
     private authService: AuthService
  ) {}

  ngOnInit(): void {

        this.sub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.locationService.selectedCountry$.subscribe((country) => {
      if (country?.name) {
        this.countryname = country.name;
        this.getMotorcycles();
      } else {
        this.countryname = 'all';
        this.getMotorcycles();
      }
    });
    
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }


    ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  getMotorcycles() {
    const countryToSearch = this.countryname || 'all';
    this.listings.getMotorcyclesByCategory(countryToSearch).subscribe((res: any) => {
      this.motorcycles = res.listings || [];
      if (!this.countryname) {
        this.searchedCountryMessage = 'Showing all countries';
      } else if (res.showing_all_countries && res.searched_country) {
        this.searchedCountryMessage = `No listings found for "${res.searched_country}". Showing all countries instead.`;
      } else {
        this.searchedCountryMessage = null;
      }
    });
  }

  get visibleMotorcycles() {
    return this.motorcycles;
  }

  // viewListing(id: number): void {
  //   this.router.navigate(['/listing', id]);
  // }
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


  // Check if we should allow sliding (only if there are more than 3 items)
  get shouldSlide(): boolean {
    return this.motorcycles.length > 3;
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
    // If there are 3 or fewer items, don't allow any sliding
    if (!this.shouldSlide) return 0;
    
    const cardWidth = this.getCardWidth();
    const visibleCards = this.getVisibleCards();
    return -((this.motorcycles.length - visibleCards) * cardWidth);
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

  endDrag() {
    // Only allow snapping if there are more than 3 items
    if (!this.shouldSlide) return;
    
    this.isDragging = false;
    const cardWidth = this.getCardWidth();

    const isRTL = document.dir === 'rtl';
    const adjustment = isRTL ? -cardWidth : cardWidth;

    this.currentPosition = Math.round(this.currentPosition / adjustment) * adjustment;

    const maxPosition = this.getMaxPosition();
    if (this.currentPosition > 0) this.currentPosition = 0;
    if (this.currentPosition < maxPosition) this.currentPosition = maxPosition;
  }

  private getX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }
}