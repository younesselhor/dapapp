import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  model,
  Inject, PLATFORM_ID
} from '@angular/core';
import { ListingByCatService } from '../services/listingsByCategory/listing-by-cat.service';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginModalComponent } from '../components/login-modal/login-modal.component';
import { FormatFieldNamePipe } from '../components/postingAdd/product-form/FormatFieldNamePipe';
import { TimeAgoPipe } from '../pipe/timeAgoPipe';
import { ListingService } from '../components/postingAdd/product-form/listingService/listing-service.service';
import { LocationSService } from '../services/location-s.service';



interface MotorcycleType {
  id: number;
  name: string;
  listings_count: number;
  selected?: boolean;
}



interface Motorcycle {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  image?: string;
  imageLoaded?: boolean; // Add this for image loading state;
  brand?: string;
  model?: string;
  year?: number;
  location?: { city: string; country: string };
  listing_date?: Date;
  condition?: string;
  currency?: string;
  // Add other properties as needed
  // add other properties as needed
}

interface Brand {
  id: number;
  name: string;
  listings_count: number;
  checked?: boolean; // optional property for the checkbox state
}

@Component({
  selector: 'app-motorcycles-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoginModalComponent,
    TimeAgoPipe,
  ],
  templateUrl: './motorcycles-details.component.html',
  styleUrls: [
    './motorcycles-details.component.css',
    '../components/sidebar/sidebar.component.css',
  ],
})
export class MotorcyclesDetailsComponent implements OnInit, OnDestroy {
  isDigitsOpen: boolean = true;
  isCountryOpen: boolean = true;
  isPlateCodeOpen: boolean = true;

  digits = [
    { value: 'new', count: 18, checked: false },
    { value: 'Used', count: 22, checked: false },
    { value: 'DabApp Exclusives', count: 23, checked: false },
  ];

  brands: Brand[] = [];
  plateCodes = [
    { value: 'A', count: 9, checked: false },
    { value: 'B', count: 17, checked: false },
    { value: 'C', count: 50, checked: false },
    { value: 'D', count: 6, checked: false },
  ];

  // brands: any[] = [];
  models: any[] = [];
  years: any[] = [];
  // filteredModels: any[] = [];

  
  filteredYears: any[] = [];

  selectedBrand: string = '';
  selectedModel: string = '';
  selectedYear: string = '';

  selectedCondition: 'new' | 'used' | '' = '';
  motorCyclesDetails: Motorcycle[] = [];
  selectedBrands: number[] = [];
  priceRange = {
    min: 0,
    max: 9000000,
  };
  absoluteMin = 0;
  absoluteMax = 0;
  isLoading = false;
  // private filterDebouncer = new Subject<void>();

  showLoginModal = false;
  isLoggedIn = false;

  activeTab: 'model' | 'category' = 'model';

  selectedCategory = '';

  brandSearchTerm = '';


  filteredModels: any[] = [];

  categories: MotorcycleType[] = [];
  selectedCategories: number[] = [];
  constructor(
    private listingbyService: ListingByCatService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private listingService: ListingService,
    private locationService: LocationSService,
        @Inject(PLATFORM_ID) private platformId: Object

  ) {}
filterDebouncer = new Subject<{ min: number; max: number }>();
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });


    this.getCategoryDetails();


   this.filterDebouncer.pipe(
    debounceTime(300),
    distinctUntilChanged((prev, curr) => 
      prev.min === curr.min && prev.max === curr.max
    )
  ).subscribe(() => {
    this.executeFilter();
  });


   // Subscribe to country changes
  this.locationService.selectedCountry$.subscribe((country) => {
    if (country) {
      this.executeFilter(); // Re-execute filter when country changes
    }
  });

    this.executeFilter();
    this.getPriceRange();
    this.getBrands();
  }





  getCategoryDetails(){
    this.listingbyService.getCategoryDetails().subscribe({
    next: (response: any) => {
      this.categories = response.motorcycle_types.map((type: any) => ({
        id: type.id,
        name: type.name,
        listings_count: type.listings_count,
        selected: false
      }));
    },
    error: (err) => {
      console.error('Error loading motorcycle types:', err);
    }
  });
  }


  selectCategory(categoryId: number) {
  const category = this.categories.find(cat => cat.id === categoryId);
  if (category) {
    category.selected = !category.selected; // Toggle selection
    
    // Update selectedCategories array
    if (category.selected) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    
    // Execute filter after updating selections
    this.executeFilter();
  }
}
  // Add this property for search functionality

  // Add this getter method
  get filteredBrands(): Brand[] {
    if (!this.brandSearchTerm) {
      return this.brands;
    }
    return this.brands.filter((brand) =>
      brand.name.toLowerCase().includes(this.brandSearchTerm.toLowerCase())
    );
  }


  switchTab(tab: 'model' | 'category') {
    this.activeTab = tab;
    // Reset selections when switching tabs
    this.resetSelections();
  }

private resetSelections() {
  this.selectedBrand = '';
  this.selectedModel = '';
  this.selectedYear = '';
  this.selectedCategory = '';
  this.selectedCategories = []; // Clear the array
  this.categories.forEach((cat) => (cat.selected = false));
}


  clearBrandSearch(): void {
    this.brandSearchTerm = '';
     this.cdr.detectChanges();
  }
  //     viewListing(id: number): void {
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
  ngOnDestroy(): void {
    this.filterDebouncer.complete();
  }

  trackByMotorcycleId(index: number, motorcycle: Motorcycle): number {
    return motorcycle.id;
  }

  // Image loading handlers
  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    const motorcycleIndex = this.motorCyclesDetails.findIndex(
      (m) => m.image === img.src
    );
    if (motorcycleIndex !== -1) {
      this.motorCyclesDetails[motorcycleIndex].imageLoaded = true;
      this.cdr.detectChanges();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Set a placeholder image or handle error
    // img.src = 'assets/images/motorcycle-placeholder.jpg'; // Add your placeholder image
    const motorcycleIndex = this.motorCyclesDetails.findIndex(
      (m) => m.image === img.src
    );
    if (motorcycleIndex !== -1) {
      this.motorCyclesDetails[motorcycleIndex].imageLoaded = true;
      this.cdr.detectChanges();
    }
  }



onMinSliderChange(event: any) {
  this.priceRange.min = +event.target.value;
  this.filterDebouncer.next({ 
    min: this.priceRange.min, 
    max: this.priceRange.max 
  });
}

onMaxSliderChange(event: any) {
  this.priceRange.max = +event.target.value;
  this.filterDebouncer.next({ 
    min: this.priceRange.min, 
    max: this.priceRange.max 
  });
}

onMinInputChange() {
  if (this.priceRange.min < this.priceRange.max) {
    this.priceRange.min = this.absoluteMin;
  }
  // if (this.priceRange.min > this.priceRange.max) {
  //   this.priceRange.min = this.priceRange.max;
  // }
  this.filterDebouncer.next({ 
    min: this.priceRange.min, 
    max: this.priceRange.max 
  });
}

onMaxInputChange() {
  if (this.priceRange.max > this.priceRange.min) {
    this.priceRange.max = this.absoluteMax;
  }
  // if (this.priceRange.max < this.priceRange.min) {
  //   this.priceRange.max = this.priceRange.min;
  // }
  this.filterDebouncer.next({ 
    min: this.priceRange.min, 
    max: this.priceRange.max 
  });
}


  onBrandChangeFilter(): void {
    this.executeFilter();
  }


  getBrands(): void {
    this.listingbyService
      .getBrandsListing()
      .subscribe((res: { motorcycle_brands: Brand[] }) => {
        this.brands = res.motorcycle_brands.map((brand) => ({
          ...brand,
          checked: false,
        }));
      });
  }

  getMotorcyclesdetails(): void {
    this.listingbyService
      .getMotorcyclesByCategory('all')
      .subscribe((response: any) => {
        this.motorCyclesDetails = response;
      });
  }



  onBrandChange(brandId: number) {
    this.selectedModel = '';
    this.selectedYear = '';
    this.filteredModels = [];
    this.filteredYears = [];

    if (brandId) {
      this.listingService.getMotorcycleModels(brandId).subscribe((res) => {
        this.models = res.data;
        this.filteredModels = res.data;
        this.executeFilter(); // مباشرة من بعد ما يختار brand
      });
    } else {
      this.executeFilter(); // حتى إلا مسح الاختيار
    }
  }

  onModelChange(modelId: number) {
    this.selectedYear = '';
    this.filteredYears = [];

    if (modelId) {
      this.listingService.getMotorcycleYears(modelId).subscribe((res) => {
        this.years = res.data;
        this.filteredYears = res.data;
        this.executeFilter(); // مباشرة من بعد ما يختار model
      });
    } else {
      this.executeFilter();
    }
  }



onBrandSearchChange(value: string): void {
  this.brandSearchTerm = value;
  // this.filterDebouncer.next(value);
  this.cdr.detectChanges();
}

  onYearChange(yearValue: string ): void {
  this.selectedYear = yearValue;
  this.executeFilter();
}


executeFilter(): void {
  this.isLoading = true;

  const selectedBrandIds = this.filteredBrands
    .filter((brand) => brand.checked)
    .map((brand) => brand.id);


     let selectedCountryName: string | null = null;
  this.locationService.selectedCountry$.subscribe((country) => {
    if (country && country.name) {
      selectedCountryName = country.name;
    }
  }).unsubscribe();


  const filterParams = {
    min_price: this.priceRange.min,
    max_price: this.priceRange.max,
    brands: selectedBrandIds.length ? selectedBrandIds : (this.selectedBrand ? [this.selectedBrand] : []),
    models: this.selectedModel ? [this.selectedModel] : [],
    years: this.selectedYear ? [this.selectedYear] : [],
     types: this.selectedCategories,
    condition: this.selectedCondition,
     country: selectedCountryName 
  };


  this.listingbyService
    .filterMotorcycles(filterParams)
    .subscribe({
      next: (response) => {
        setTimeout(() => {
          const motorcycles = response.motorcycles || response;
          this.motorCyclesDetails = motorcycles.map((m: Motorcycle) => ({
            ...m,
            imageLoaded: false,
          }));
          this.isLoading = false;
          this.cdr.detectChanges();
          this.animateCards();
        }, 300);
      },
      error: (err) => {
        console.error('Error filtering motorcycles:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
}

  private animateCards(): void {
    // Add animation classes with staggered delays
    setTimeout(() => {
       if (isPlatformBrowser(this.platformId)) {
      const cards = document.querySelectorAll('.product-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-fade-in-up');
        }, index * 100);
      });
    }
    }, 50);
  
  }

  getPriceRange(): void {
    this.listingbyService.getPriceRange(1).subscribe({
      next: (res: any) => {
        // Set default minimum if 0
        this.absoluteMin = res.min_price > 0 ? res.min_price : 0;
        // Set default maximum if 0
        this.absoluteMax = res.max_price > 0 ? res.max_price : 9000000;

        this.priceRange = {
          min: this.absoluteMin,
          max: this.absoluteMax,
        };

        // Load data with initial reasonable prices
        this.executeFilter();
      },
      error: (err) => {
        console.error('Error getting price range:', err);
        // Fallback defaults
        this.absoluteMin = 1000;
        this.absoluteMax = 50000;
        this.priceRange = {
          min: this.absoluteMin,
          max: this.absoluteMax,
        };
        this.executeFilter();
      },
    });
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  toggleDigits(): void {
    this.isDigitsOpen = !this.isDigitsOpen;
  }

  toggleCountry(): void {
    this.isCountryOpen = !this.isCountryOpen;
  }

  togglePlateCode(): void {
    this.isPlateCodeOpen = !this.isPlateCodeOpen;
  }
}
