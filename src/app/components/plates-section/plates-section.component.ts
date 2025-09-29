// plates-section.component.ts - COMPLETE FIX
import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocationSService } from '../../services/location-s.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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
      field_position: string;
      value: string;
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
  selector: 'app-plates-section',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, TranslateModule],
  templateUrl: './plates-section.component.html',
  styleUrl: './plates-section.component.css'
})
export class PlatesSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  plates: Plate[] = [];
  soldCount: number = 500;
  availableCount: number = 3000;
  
  allPositions: string[] = [
    'top-left', 'top-center', 'top-right',
    'left-center', 'center', 'right-center',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  // Slider properties
  currentPosition = 0;
  isDragging = false;
  startX = 0;
  startPosition = 0;
  gap = 31; // Match your CSS gap

  // FIXED: Proper subscription management
  private locationSubscription?: Subscription;
  private isLoading = false;
  private isDestroyed = false;
  
  // FIXED: Correct card dimensions matching CSS
  cardWidth = 324 + 16; // 324px card + 16px gap = 340px
  mobileCardWidth = 280 + 16; // 280px card + 16px gap = 296px
  tabletCardWidth = 300 + 16; // 300px card + 16px gap = 316px
  
  // Responsive properties
  isMobile = false;
  isTablet = false;
  containerWidth = 0;
  
  countryname?: string | null;
  searchedCountryMessage: string | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private locationService: LocationSService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('PlatesSectionComponent constructed at:', new Date().toISOString());
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.fetchPlates();

    // FIXED: Single subscription management
    this.locationSubscription = this.locationService.selectedCountry$.subscribe((country) => {
      if (this.isDestroyed) return;
      
      const newCountryName = country?.name;
      if (newCountryName && newCountryName !== this.countryname) {
        this.countryname = newCountryName;
        this.fetchPlates();
      }
    });
  }


  
    ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  checkMobile() {
    if (isPlatformBrowser(this.platformId)) {
    this.isMobile = window.innerWidth < 768;
    this.currentPosition = 0;
    }

  }

  // Check if we should allow sliding (only if there are more than 3 items)
  get shouldSlide(): boolean {
    return this.plates.length > 3;
  }

  getVisibleCards() {
    return this.isMobile ? 1 : 3;
  }

  // getCardWidth() {
  //   const card = document.querySelector<HTMLElement>('.slider-card');
  //   return card ? card.offsetWidth : 324; // fallback to 324px
  // }
  getCardWidth() {
  if (isPlatformBrowser(this.platformId)) {
    const card = document.querySelector<HTMLElement>('.slider-card');
    return card ? card.offsetWidth : this.cardWidth;
  }
  return this.cardWidth; // Return fallback during SSR
}

  fetchPlates(): void {
    if (this.isLoading || this.isDestroyed) return;

    this.isLoading = true;
    
    const url = this.countryname
      ? `https://be.dabapp.co/api/listings/by-category/3?country=${this.countryname}`
      : `https://be.dabapp.co/api/listings/by-category/3?country=all`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (this.isDestroyed) return;
        
        const listings = response.listings || [];
        this.plates = listings.filter((plate: Plate) => plate.license_plate);

        if (response.showing_all_countries && response.searched_country) {
          this.searchedCountryMessage = `No listings found for "${response.searched_country}". Showing all countries instead.`;
        } else {
          this.searchedCountryMessage = null;
        }

        this.isLoading = false;
      },
      error: (error) => {
        if (this.isDestroyed) return;
        console.error('Error fetching plates:', error);
        this.searchedCountryMessage = 'Unable to load listings.';
        this.isLoading = false;
      }
    });
  }

  startDrag(event: MouseEvent | TouchEvent) {
    if (!this.shouldSlide) return;

    this.isDragging = true;
    this.startX = this.getX(event);
    this.startPosition = this.currentPosition;
    event.preventDefault();
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (isPlatformBrowser(this.platformId)) {
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
  }

  getMaxPosition(): number {
    if (!this.shouldSlide || this.plates.length <= 0) return 0;

    const cardWidth = this.getCardWidth();
    const gap = this.gap;

    // Calculate total width of all cards including gaps
    const totalWidth = this.plates.length * cardWidth + (this.plates.length - 1) * gap;

    // Maximum position is the difference (negative)
    return -(totalWidth - cardWidth);
  }

  endDrag() {
    if (!this.shouldSlide) return;

    this.isDragging = false;
    const cardWidth = this.getCardWidth() + this.gap;
    this.currentPosition = Math.round(this.currentPosition / cardWidth) * cardWidth;

    const maxPosition = this.getMaxPosition();
    if (this.currentPosition > 0) this.currentPosition = 0;
    if (this.currentPosition < maxPosition) this.currentPosition = maxPosition;
  }

  private getX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  // ngAfterViewInit(): void {
  //   if (!this.isDestroyed) {
  //     this.updateContainerWidth();
  //   }
  // }

  // ngOnDestroy(): void {
  //   this.isDestroyed = true;
    
  //   if (this.locationSubscription) {
  //     this.locationSubscription.unsubscribe();
  //   }
  // }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.isDestroyed) return;
     if (isPlatformBrowser(this.platformId)) {
    this.checkScreenSize();
    this.updateContainerWidth();
    this.resetPosition();
     }
  }


  getCountryNameAbbreviated(plate: Plate): string {
  const fullName = plate.license_plate?.plate_format.country.name || '';
  
  // Abbreviate long names
  const abbreviations: { [key: string]: string } = {
    'United Arab Emirates': 'UAE',
    'Saudi Arabia': 'KSA',
    'KWAIT': 'KWT'
  };
  
  return abbreviations[fullName] || fullName;
}


  private checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
    const width = window.innerWidth;
    this.isMobile = width < 768;
    this.isTablet = width >= 768 && width < 1024;
    }
  }

  private updateContainerWidth(): void {
    if (isPlatformBrowser(this.platformId)) {
    if (this.isMobile) {
      this.containerWidth = window.innerWidth - 32;
    } else if (this.isTablet) {
      this.containerWidth = 650;
    } else {
      this.containerWidth = 1024;
    }
  }
  }

  private resetPosition(): void {
    this.currentPosition = 0;
  }

  // // FIXED: Prevent multiple simultaneous API calls
  // fetchPlates(): void {
  //   if (this.isLoading || this.isDestroyed) {
  //     return;
  //   }

  //   this.isLoading = true;
    
  //   const url = this.countryname
  //     ? `https://be.dabapp.co/api/listings/by-category/3?country=${this.countryname}`
  //     : `https://be.dabapp.co/api/listings/by-category/3?country=all`;

  //   console.log('Fetching plates from:', url);

  //   this.http.get<any>(url).subscribe({
  //     next: (response) => {
  //       if (this.isDestroyed) return;
        
  //       const listings = response.listings || [];
  //       this.plates = listings.filter((plate: Plate) => plate.license_plate);

  //       if (response.showing_all_countries && response.searched_country) {
  //         this.searchedCountryMessage = `No listings found for "${response.searched_country}". Showing all countries instead.`;
  //       } else {
  //         this.searchedCountryMessage = null;
  //       }

  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       if (this.isDestroyed) return;
        
  //       console.error('Error fetching plates:', error);
  //       this.searchedCountryMessage = 'Unable to load listings.';
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // // Slider methods
  // getCardWidth(): number {
  //   if (this.isMobile) return this.mobileCardWidth;
  //   if (this.isTablet) return this.tabletCardWidth;
  //   return this.cardWidth;
  // }

  // getVisibleCards(): number {
  //   if (this.isMobile) return 1;
  //   if (this.isTablet) return 2;
  //   return 3;
  // }

  // getMaxPosition(): number {
  //   const cardWidth = this.getCardWidth();
  //   const visibleCards = this.getVisibleCards();
  //   const totalCards = this.plates.length;
    
  //   if (totalCards <= visibleCards) return 0;
    
  //   const maxOffset = (totalCards - visibleCards) * cardWidth;
  //   return -maxOffset;
  // }

  // startDrag(event: MouseEvent | TouchEvent): void {
  //   this.isDragging = true;
  //   this.startX = this.getX(event);
  //   this.startPosition = this.currentPosition;
  //   event.preventDefault();
  // }

  // onDrag(event: MouseEvent | TouchEvent): void {
  //   if (!this.isDragging) return;
    
  //   const x = this.getX(event);
  //   const dragDistance = x - this.startX;
  //   this.currentPosition = this.startPosition + dragDistance;
    
  //   // Apply boundaries
  //   const maxPosition = this.getMaxPosition();
  //   this.currentPosition = Math.max(maxPosition, Math.min(0, this.currentPosition));
  // }

  // endDrag(): void {
  //   if (!this.isDragging) return;
    
  //   this.isDragging = false;
    
  //   // Snap to nearest card
  //   const cardWidth = this.getCardWidth();
  //   const snapPosition = Math.round(this.currentPosition / cardWidth) * cardWidth;
  //   const maxPosition = this.getMaxPosition();
    
  //   this.currentPosition = Math.max(maxPosition, Math.min(0, snapPosition));
  // }

  // private getX(event: MouseEvent | TouchEvent): number {
  //   return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  // }

  // Plate helper methods
  viewListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }

  getCountryName(plate: Plate): string {
    return plate.license_plate?.plate_format.country.name || '';
  }

  isAuction(plate: Plate): boolean {
    return plate.auction_enabled === 1;
  }

  getPlateBackgroundClass(plate: any): string {
    const countryCode = plate.license_plate?.plate_format?.country?.code;
    
    switch(countryCode) {
      case 'AE': return 'uae-bg';
      case 'SA': return 'saudi-bg';
      case 'KW': return 'kuwait-bg';
      default: return 'default-bg';
    }
  }

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

  getPlateFieldMap(plate: Plate): { [position: string]: string } {
    const map: { [key: string]: string } = {};
    plate.license_plate?.fields?.forEach(field => {
      if (field.field_position && field.value) {
        map[field.field_position] = field.value;
      }
    });
    return map;
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
      case 'KW': return 'bg-[#d32f2f]'; // Red
      case 'AE': return 'bg-[#6b21a8]'; // Purple
      default: return 'bg-[#138c36]'; // KSA green fallback
    }
  }


}