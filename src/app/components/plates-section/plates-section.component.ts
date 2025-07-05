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
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, RouterModule, HttpClientModule],
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
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPlates();
  }

  fetchPlates(): void {
    this.http.get<any>('https://be.dabapp.co/api/listings/by-category/3')
      .subscribe({
        next: (response) => {
          this.plates = (response || []).filter((plate: Plate) => plate.license_plate);
          this.availableCount = this.plates.length;
        },
        error: (error) => {
          console.error('Error fetching plates:', error);
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


}