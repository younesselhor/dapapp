// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// interface Plate {
//   id: number;
//   country: string;
//   price: number;
//   currency: string;
//   imageUrl: string;
// }
// @Component({
//   selector: 'app-plates-section',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './plates-section.component.html',
//   styleUrl: './plates-section.component.css'
// })
// export class PlatesSectionComponent {

//   plates: Plate[] = [
//     {
//       id: 1,
//       country: 'SAUDI ARABIA',
//       price: 700,
//       currency: 'SAR',
//       imageUrl: '/pictures/plates.png'
//     },
//     {
//       id: 2,
//       country: 'UNITED ARAB EMIRATES',
//       price: 1200,
//       currency: 'AED',
//       imageUrl: '/pictures/plates.png'
//     },
//     {
//       id: 3,
//       country: 'SAUDI ARABIA',
//       price: 700,
//       currency: 'SAR',
//       imageUrl: '/pictures/plates.png'
//     }
//   ];
// }

// plates-section.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocationSService } from '../../services/location-s.service';
import { TranslateModule } from '@ngx-translate/core';

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
  imports: [CommonModule, RouterModule, HttpClientModule,TranslateModule],
  templateUrl: './plates-section.component.html',
  styleUrl: './plates-section.component.css'
})
export class PlatesSectionComponent implements OnInit {
  plates: Plate[] = [];
  soldCount: number = 500;
  availableCount: number = 3000;
allPositions: string[] = [
  'top-left', 'top-center', 'top-right',
  'left-center', 'center', 'right-center',
  'bottom-left', 'bottom-center', 'bottom-right'
];
currentSlide = 0;
slidesToShow = 1;


 touchStartX = 0;
  // isDragging = false;
  // startPosition = 0;
  containerWidth = 1024; // Width of visible container area
  itemsPerSlide = 3;

  currentPosition = 0;
  isDragging = false;
  startX = 0;
  startPosition = 0;
  cardWidth = 324; // Desktop card width
  mobileCardWidth = 300; // Mobile card width
  isMobile = false;
  countryname?: string | null;
    constructor(private http: HttpClient, private router : Router, private locationService: LocationSService) {}

  // ngOnInit(): void {

  //     this.locationService.selectedCountry$.subscribe((country) => {
  //   if (country?.id) {
  //     this.countryId = country.id;
  //     console.log('this.countryId : ', this.countryId );
  //      this.fetchPlates();
  //   }
  // });

   
  // }
ngOnInit(): void {
  // Call initially without country
  this.fetchPlates();

  // If user selects a country, re-fetch with that country
  this.locationService.selectedCountry$.subscribe((country) => {
    if (country?.name) {
      this.countryname = country.name;
      this.fetchPlates();
    }
  });
}


  // fetchPlates(): void {
  //   this.http.get<any>('https://be.dabapp.co/api/listings/by-category/3')
  //     .subscribe({
  //       next: (response) => {
  //         this.plates = (response || []).filter((plate: Plate) => plate.license_plate);
  //         // this.availableCount = this.plates.length;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching plates:', error);
  //       }
  //     });
  // }
//   fetchPlates(): void {
//   const url = this.countryId
//     ? `https://be.dabapp.co/api/listings/by-category/3?country=${this.countryId}`
//     : `https://be.dabapp.co/api/listings/by-category/3`;

//   this.http.get<any>(url).subscribe({
//     next: (response) => {
//       this.plates = (response).filter((plate: Plate) => plate.license_plate);
//       // this.availableCount = this.plates.length;
//     },
//     error: (error) => {
//       console.error('Error fetching plates:', error);
//     }
//   });
// }

searchedCountryMessage: string | null = null;
// plates: Plate[] = [];

fetchPlates(): void {
  const url = this.countryname
    ? `https://be.dabapp.co/api/listings/by-category/3?country=${this.countryname}`
    : `https://be.dabapp.co/api/listings/by-category/3?country=all`;

  this.http.get<any>(url).subscribe({
    next: (response) => {
      const listings = response.listings || [];

      // Optional: filter plates if needed
      this.plates = listings.filter((plate: Plate) => plate.license_plate);

      if (response.showing_all_countries && response.searched_country) {
        this.searchedCountryMessage = `No listings found for "${response.searched_country}". Showing all countries instead.`;
      } else {
        this.searchedCountryMessage = null;
      }
    },
    error: (error) => {
      console.error('Error fetching plates:', error);
      this.searchedCountryMessage = 'Unable to load listings.';
    }
  });
}


  getAriaLabel(index: number): string {
  return `Go to slide ${index + 1}`;
}
  getHorizontalFields(fieldMap: { [key: string]: string }): string[] {
  const order = ['left-center', 'center', 'right-center'];
  return order
    .filter(pos => fieldMap[pos])
    .map(pos => fieldMap[pos]);
}

  viewListing(id: number): void {
  this.router.navigate(['/listing', id]);
}
  getPlateNumber(plate: Plate): string {
    if (!plate.license_plate) return '';
    const numberField = plate.license_plate.fields.find(f => 
      f.field_name.toLowerCase().includes('number') || 
      f.field_name.toLowerCase().includes('digits')
    );
    return numberField?.value || '';
  }

  getPlateLetters(plate: Plate): string {
    if (!plate.license_plate) return '';
    const letterField = plate.license_plate.fields.find(f => 
      f.field_name.toLowerCase().includes('letter') || 
      f.field_name.toLowerCase().includes('letters')
    );
    return letterField?.value || '';
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
    case 'KW':
      return 'bg-[#d32f2f]'; // Red
    case 'AE':
      return 'bg-[#6b21a8]'; // Purple
    default:
      return 'bg-[#138c36]'; // KSA green fallback
  }
}

ngAfterViewInit() {
  this.updateSlidesToShow();
  window.addEventListener('resize', () => this.updateSlidesToShow());
}

updateSlidesToShow() {
  const width = window.innerWidth;
  if (width >= 1024) {
    this.slidesToShow = 3;
  } else if (width >= 640) {
    this.slidesToShow = 2;
  } else {
    this.slidesToShow = 1;
  }
}


 
nextSlide() {
  this.currentSlide = Math.min(this.currentSlide + 1, this.plates.length - this.slidesToShow);
}

prevSlide() {
  this.currentSlide = Math.max(this.currentSlide - 1, 0);
}

goToSlide(index: number) {
  this.currentSlide = index;
}


// getPlateFieldMap(plate: Plate): { [position: string]: string } {
//   const fieldMap: { [position: string]: string } = {};
//   plate.license_plate?.fields?.forEach(field => {
//     if (field.field_position && field.value) {
//       fieldMap[field.field_position] = field.value;
//     }
//   });
//   return fieldMap;
// }
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

  // getMaxPosition() {
  //   const cardWidth = this.getCardWidth();
  //   const visibleCards = this.getVisibleCards();
  //   return -((this.plates.length - visibleCards) * cardWidth);
  // }

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

  // endDrag() {
  //   this.isDragging = false;
  //   // Snap to nearest card
  //   const cardWidth = this.getCardWidth();
  //   this.currentPosition = Math.round(this.currentPosition / cardWidth) * cardWidth;
  // }

  private getX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  // Update these methods in your component
getMaxPosition() {
  const cardWidth = this.getCardWidth();
  const visibleCards = this.getVisibleCards();
  const totalWidth = this.plates.length * cardWidth;
  const containerWidth = window.innerWidth * 0.9; // Adjust based on your layout
  return Math.min(0, containerWidth - totalWidth);
}

endDrag() {
  this.isDragging = false;
  // Snap to nearest card with boundary checks
  const cardWidth = this.getCardWidth();
  const newPosition = Math.round(this.currentPosition / cardWidth) * cardWidth;
  const maxPosition = this.getMaxPosition();
  
  this.currentPosition = Math.max(maxPosition, Math.min(0, newPosition));
}

}