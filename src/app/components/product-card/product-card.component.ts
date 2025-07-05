import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


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
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,CardModule,ButtonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() plateData: any;

  allPositions: string[] = [
  'top-left', 'top-center', 'top-right',
  'left-center', 'center', 'right-center',
  'bottom-left', 'bottom-center', 'bottom-right'
];
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
}
