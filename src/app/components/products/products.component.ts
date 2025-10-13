import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';
import { NgxSliderModule, Options, ChangeContext } from '@angular-slider/ngx-slider';

import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Plate {
  id: number;
  title: string;
  description: string;
  price: string | null;
  image: string | null;
  currency?: string;
  seller_location?: {
    country: string;
    city: string;
  };
  license_plate?: {
    format: string;
    plate_location: {
      city: string;
      country: string;
    };
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
  imports: [CommonModule, FormsModule, RouterModule, NgxSliderModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  plates: Plate[] = [];
  filteredPlates: Plate[] = [];
  
  // Separate search queries
  countrySearchQuery: string = ''; // For filtering displayed countries
  plateSearchQuery: string = '';   // For API plate search
  
  isLoading: boolean = false;
  
  isCountryOpen = true;
  
  countries = [
    { id: 1, code: 'KSA', name: 'Saudi Arabia', checked: false },
    { id: 2, code: 'UAE', name: 'United Arab Emirates', checked: false },
    { id: 3, code: 'KW', name: 'Kuwait', checked: false }
  ];

  // Filtered countries for display
  get filteredCountries() {
    if (!this.countrySearchQuery.trim()) {
      return this.countries;
    }
    const query = this.countrySearchQuery.toLowerCase();
    return this.countries.filter(country => 
      country.code.toLowerCase().includes(query) || 
      country.name.toLowerCase().includes(query)
    );
  }

  priceRange = {
    min: 0,
    max: 10000
  };
  
  allPositions: string[] = [
    'top-left', 'top-center', 'top-right',
    'left-center', 'center', 'right-center',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];
  
  absoluteMin = 0;
  absoluteMax = 10000;
  
  isBrowser = false;
  
  // Subjects for debouncing
  private priceChangeSubject = new Subject<{ min: number, max: number }>();
  private plateSearchSubject = new Subject<string>(); // Add this for plate search debouncing
  
  options: Options = {
    floor: 0,
    ceil: 10000,
    step: 10,
    showTicks: false,
    showSelectionBar: true,
    translate: (value: number): string => `${value} SAR`,
  };

  constructor(
    private listingService: ListingByCatService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.setupPriceDebounce();
    this.setupPlateSearchDebounce(); // Add this
    this.getPriceRange();
  }

  ngOnDestroy() {
    this.priceChangeSubject.complete();
    this.plateSearchSubject.complete(); // Add this
  }

  // Setup debouncing for price changes
  setupPriceDebounce() {
    this.priceChangeSubject.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => 
        prev.min === curr.min && prev.max === curr.max
      )
    ).subscribe(priceRange => {
      console.log('Debounced price change:', priceRange);
      this.loadPlates();
    });
  }

  // Setup debouncing for plate search
  setupPlateSearchDebounce() {
    this.plateSearchSubject.pipe(
      debounceTime(500), // Wait 500ms after user stops typing
      distinctUntilChanged() // Only trigger if value actually changed
    ).subscribe(searchQuery => {
      console.log('Debounced plate search:', searchQuery);
      this.loadPlates();
    });
  }

  // Called when user types in plate search input
  // onPlateSearchChange() {
  //   this.plateSearchSubject.next(this.plateSearchQuery);
  // }

  // Called when slider value changes
  onSliderChange(changeContext: ChangeContext): void {
    console.log('Slider change event:', changeContext);
    
    if (changeContext.value !== undefined && changeContext.highValue !== undefined) {
      this.priceRange.min = changeContext.value;
      this.priceRange.max = changeContext.highValue;
      
      console.log('New price range:', this.priceRange);
      
      this.priceChangeSubject.next({
        min: this.priceRange.min,
        max: this.priceRange.max
      });
    }
  }

  // Called when user types in plate search input
onPlateSearchChange() {
  console.log('Plate search changed to:', this.plateSearchQuery); // Debug log
  this.plateSearchSubject.next(this.plateSearchQuery);
}

  onMinInputChange() {
    if (this.priceRange.min < this.absoluteMin) {
      this.priceRange.min = this.absoluteMin;
    }
    if (this.priceRange.min > this.priceRange.max) {
      this.priceRange.max = this.priceRange.min;
    }
    
    this.updateSliderOptions();
    this.loadPlates();
  }

  onMaxInputChange() {
    if (this.priceRange.max > this.absoluteMax) {
      this.priceRange.max = this.absoluteMax;
    }
    if (this.priceRange.max < this.priceRange.min) {
      this.priceRange.min = this.priceRange.max;
    }
    
    this.updateSliderOptions();
    this.loadPlates();
  }

  updateSliderOptions() {
    this.options = Object.assign({}, this.options);
  }

  getPriceRange() {
    this.listingService.getPriceRange(3).subscribe({
      next: (res: any) => {
        this.absoluteMin = res.min_price > 0 ? res.min_price : 0;
        this.absoluteMax = res.max_price > 0 ? res.max_price : 10000;
        
        this.priceRange = {
          min: this.absoluteMin,
          max: this.absoluteMax
        };
        
        this.options = {
          ...this.options,
          floor: this.absoluteMin,
          ceil: this.absoluteMax
        };
        
        console.log('Price range loaded:', this.priceRange);
        this.loadPlates();
      },
      error: (err) => {
        console.error('Error getting price range:', err);
        this.absoluteMin = 0;
        this.absoluteMax = 10000;
        this.priceRange = {
          min: this.absoluteMin,
          max: this.absoluteMax
        };
        this.loadPlates();
      }
    });
  }

  loadPlates() {
    this.isLoading = true;
    const params = this.buildFilterParams();
    
    console.log('Loading plates with params:', params);
    
    this.listingService.filterLicencePlate(params).subscribe({
      next: (res) => {
        this.plates = res.results || res;
        this.filteredPlates = [...this.plates];
        this.isLoading = false;
        console.log('Plates loaded:', this.plates.length);
      },
      error: (err) => {
        console.error('Error loading plates:', err);
        this.isLoading = false;
        this.plates = [];
        this.filteredPlates = [];
      }
    });
  }

  // buildFilterParams(): any {
  //   const params: any = {};
    
  //   // Add plate search query (from second search box)
  //   if (this.plateSearchQuery.trim()) {
  //     params.plate_search = this.plateSearchQuery.trim();
  //   }
    
  //   // Always include price range
  //   params.min_price = this.priceRange.min;
  //   params.max_price = this.priceRange.max;
    
  //   // Add selected countries
  //   const selectedCountries = this.countries
  //     .filter(c => c.checked)
  //     .map(c => c.id);
      
  //   if (selectedCountries.length > 0) {
  //     params.country_id = selectedCountries[0];
  //     // If your API supports multiple countries:
  //     // params.country_ids = selectedCountries.join(',');
  //   }
    
  //   return params;
  // }

  buildFilterParams(): any {
  const params: any = {};
  
  // Add plate search query (from second search box)
  if (this.plateSearchQuery.trim()) {
    params.plate_search = this.plateSearchQuery.trim();
    console.log('Adding plate_search to params:', params.plate_search); // Debug log
  }
  
  // Always include price range
  params.min_price = this.priceRange.min;
  params.max_price = this.priceRange.max;
  
  // Add selected countries
  const selectedCountries = this.countries
    .filter(c => c.checked)
    .map(c => c.id);
    
  if (selectedCountries.length > 0) {
    params.country_id = selectedCountries[0];
  }
  
  console.log('Final filter params:', params); // Debug log to see all params
  
  return params;
}
  applyFilters() {
    this.loadPlates();
  }

  resetFilters() {
    this.plateSearchQuery = '';
    this.countrySearchQuery = '';
    this.priceRange = { 
      min: this.absoluteMin, 
      max: this.absoluteMax 
    };
    this.countries.forEach(c => c.checked = false);
    this.updateSliderOptions();
    this.applyFilters();
  }

  getCountryCode(plate: Plate): string {
    const country = plate.license_plate?.plate_location?.country || 
                    plate.seller_location?.country || '';
    const countryUpper = country.toUpperCase();
    
    if (countryUpper.includes('SAUDI')) return 'KSA';
    if (countryUpper.includes('EMARAT') || countryUpper.includes('ARAB EMIRATES')) return 'UAE';
    if (countryUpper.includes('KWAIT') || countryUpper.includes('KUWAIT')) return 'KW';
    
    return '';
  }

  getCountryName(plate: Plate): string {
    const country = plate.license_plate?.plate_location?.country || 
                    plate.seller_location?.country || '';
    
    const countryUpper = country.toUpperCase();
    
    if (countryUpper.includes('SAUDI')) return 'Saudi Arabia';
    if (countryUpper.includes('EMARAT') || countryUpper.includes('ARAB EMIRATES')) return 'United Arab Emirates';
    if (countryUpper.includes('KWAIT') || countryUpper.includes('KUWAIT')) return 'Kuwait';
    
    return country;
  }

  getCountryCodeAbbreviated(plate: Plate): string {
    const fullName = plate.license_plate?.plate_location?.country || '';
    
    const abbreviations: { [key: string]: string } = {
      'United Arab Emirates': 'UAE',
      'Saudi Arabia': 'KSA',
      'KWAIT': 'KWT',
      'Kuwait': 'KWT'
    };
    
    return abbreviations[fullName] || fullName.substring(0, 8);
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
    // Immediately call API when country checkbox changes
    this.applyFilters();
  }
}