import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';

interface Plate {
  id: number;
  title: string;
  description: string;
  price: string | null;
  image: string | null;
  license_plate?: {
    format: string;
    city: string;
    country: string;
    fields: {
      field_id: number;
      field_name: string;
      value: string;
    }[];
  };
}

interface PlateField {
  field_id: number;
  field_name: string;
  value: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  plates: Plate[] = [];
  filteredPlates: Plate[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  
  // Filter properties
  isCountryOpen = true;
  
  // Updated countries with proper IDs matching your API
  countries = [
    { id: 1, code: 'KSA', name: 'Saudi Arabia', checked: false },
    { id: 2, code: 'UAE', name: 'United Arab Emirates', checked: false },
    { id: 3, code: 'KW', name: 'Kuwait', checked: false }
  ];

  priceRange = {
    min: 0,
    max: 10000
  };
   absoluteMin = 0;
   absoluteMax = 0;
  allPositions: string[] = [
    'top-left', 'top-center', 'top-right',
    'left-center', 'center', 'right-center',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  constructor(
    private listingService: ListingByCatService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlates();
  }

  loadPlates() {
    this.isLoading = true;
    const params = this.buildFilterParams();
    
    this.listingService.filterLicencePlate(params).subscribe({
      next: (res) => {
        this.plates = res.results || res; // Handle different response structures
        this.filteredPlates = [...this.plates];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading plates:', err);
        this.isLoading = false;
        this.plates = [];
        this.filteredPlates = [];
      }
    });
  }

    onMinSliderChange(event: any) {
    this.priceRange.min = +event.target.value;
    // this.applyFilters();
        this.loadPlates();

  }

  onMaxSliderChange(event: any) {
    this.priceRange.max = +event.target.value;
    // this.applyFilters();
        this.loadPlates();

  }
    getPriceRange() {
  this.listingService.getPriceRange(3).subscribe({
    next: (res: any) => {
      // Set default minimum if 0
      this.absoluteMin = res.min_price > 0 ? res.min_price : 1000; 
      // Set default maximum if 0
      this.absoluteMax = res.max_price > 0 ? res.max_price : 50000;
      
      this.priceRange = {
        min: this.absoluteMin,
        max: this.absoluteMax
      };
      
      // Load data with initial reasonable prices
      // this.executeFilter();
    },
    error: (err) => {
      console.error('Error getting price range:', err);
      // Fallback defaults
      this.absoluteMin = 1000;
      this.absoluteMax = 50000;
      this.priceRange = {
        min: this.absoluteMin,
        max: this.absoluteMax
      };
      // this.executeFilter();
    }
  });
}
  buildFilterParams(): any {
    const params: any = {};
    
    // Add search query if exists
    if (this.searchQuery.trim()) {
      params.plate_search = this.searchQuery.trim();
    }
    
    // Add price range
    if (this.priceRange.min > 0) {
      params.min_price = this.priceRange.min;
    }
    if (this.priceRange.max < 10000) {
      params.max_price = this.priceRange.max;
    }
    
    // Add selected countries using country_id
    const selectedCountries = this.countries
      .filter(c => c.checked)
      .map(c => c.id);
      
    if (selectedCountries.length > 0) {
      // If multiple countries selected, you might need to handle this differently
      // For now, using the first selected country
      params.country_id = selectedCountries[0];
      
      // If API supports multiple countries, use this instead:
      // params.country_ids = selectedCountries.join(',');
    }
    
    return params;
  }

  applyFilters() {
    this.loadPlates();
  }

  resetFilters() {
    this.searchQuery = '';
    this.priceRange = { min: 0, max: 10000 };
    this.countries.forEach(c => c.checked = false);
    this.applyFilters();
  }

  getCountryCode(plate: Plate): string {
    const country = plate.license_plate?.country?.toUpperCase() || '';
    if (country.includes('SAUDI')) return 'KSA';
    if (country.includes('EMARAT')) return 'UAE';
    if (country.includes('KWAIT')) return 'KW';
    return '';
  }

  getCountryName(plate: Plate): string {
    const country = plate.license_plate?.country || '';
    switch (country.toUpperCase()) {
      case 'SAUDI': return 'Saudi Arabia';
      case 'EMARAT': return 'United Arab Emirates';
      case 'KWAIT': return 'Kuwait';
      default: return country;
    }
  }

  getPlateBackgroundClass(plate: Plate): string {
    const countryCode = this.getCountryCode(plate);
    switch(countryCode) {
      case 'UAE': return 'uae-bg';
      case 'KSA': return 'saudi-bg';
      case 'KW': return 'kuwait-bg';
      default: return 'default-bg';
    }
  }

  getSaudiPlateParts(plate: Plate): {
    arLetters: string,
    arNumbers: string,
    enLetters: string,
    enNumbers: string
  } | null {
    const fields = plate.license_plate?.fields || [];
    
    const arLetters = fields.find(f => 
      f.field_name.toLowerCase().includes('letter') && 
      f.field_name.toLowerCase().includes('arabic')
    )?.value || '';

    const arNumbers = fields.find(f => 
      f.field_name.toLowerCase().includes('number') && 
      f.field_name.toLowerCase().includes('arabic')
    )?.value || '';

    const enLetters = fields.find(f => 
      f.field_name.toLowerCase().includes('letter') && 
      f.field_name.toLowerCase().includes('english')
    )?.value || '';

    const enNumbers = fields.find(f => 
      f.field_name.toLowerCase().includes('number') && 
      f.field_name.toLowerCase().includes('english')
    )?.value || '';

    return { arLetters, arNumbers, enLetters, enNumbers };
  }

  getPlateFieldMap(plate: Plate): { [position: string]: string } {
    const map: { [key: string]: string } = {};
    plate.license_plate?.fields?.forEach(field => {
      if (field.field_name.includes('number') && field.field_name.includes('english')) {
        map['center'] = field.value;
      } else if (field.field_name.includes('letter') && field.field_name.includes('english')) {
        map['right-center'] = field.value;
      } else if (field.field_name.includes('number') && field.field_name.includes('arabic')) {
        map['left-center'] = field.value;
      } else if (field.field_name.includes('letter') && field.field_name.includes('arabic')) {
        map['bottom-center'] = field.value;
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
    const code = this.getCountryCode(plate);
    switch (code) {
      case 'KW': return 'bg-[#d32f2f]';
      case 'UAE': return 'bg-[#6b21a8]';
      default: return 'bg-[#138c36]';
    }
  }

  viewListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }

  toggleCountry() {
    this.isCountryOpen = !this.isCountryOpen;
  }

  onCheckboxChange() {
    this.applyFilters();
  }

  onMinInputChange() {
    if (this.priceRange.min < 0) this.priceRange.min = 0;
    if (this.priceRange.min > this.priceRange.max) {
      this.priceRange.max = this.priceRange.min;
    }
    this.applyFilters();
  }

  onMaxInputChange() {
    if (this.priceRange.max < this.priceRange.min) {
      this.priceRange.min = this.priceRange.max;
    }
    this.applyFilters();
  }
}