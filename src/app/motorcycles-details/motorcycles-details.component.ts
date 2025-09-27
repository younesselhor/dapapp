import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  model,
} from '@angular/core';
import { ListingByCatService } from '../services/listingsByCategory/listing-by-cat.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginModalComponent } from '../components/login-modal.component';
import { FormatFieldNamePipe } from '../components/postingAdd/product-form/FormatFieldNamePipe';
import { TimeAgoPipe } from '../pipe/timeAgoPipe';
import { ListingService } from '../components/postingAdd/product-form/listingService/listing-service.service';

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
  private filterDebouncer = new Subject<void>();

  showLoginModal = false;
  isLoggedIn = false;

  activeTab: 'model' | 'category' = 'model';
  // selectedBrand = '';
  // selectedModel = '';
  // selectedYear = '';
  selectedCategory = '';

  brandSearchTerm = '';

  //  brands = [
  //     { id: 1, name: 'Honda' } ,
  //      { id: 2, name: 'Yamaha' },
  //     { id: 3, name: 'Kawasaki' },
  //     { id: 4, name: 'Suzuki' },
  //     // Add more brands
  //   ];

  // models = [
  //   { id: 1, name: 'CBR600RR', brandId: 1 },
  //   { id: 2, name: 'R6', brandId: 2 },
  //   // Add more models
  // ];

  // years = [
  //   { value: 2024, label: '2024' },
  //   { value: 2023, label: '2023' },
  //   { value: 2022, label: '2022' },
  //   { value: 2021, label: '2021' },

  // ];
  filteredModels: any[] = [];
  categories = [
    { id: 1, name: 'Crosair', image: '', selected: false },
    { id: 2, name: 'Tuning', image: '', selected: true },
    { id: 3, name: 'Racing', image: '', selected: false },
    { id: 4, name: 'Offroad', image: '', selected: false },
    { id: 5, name: 'Desert', image: '', selected: false },
    { id: 6, name: 'Street', image: '', selected: false },
    { id: 7, name: 'Crosair', image: '', selected: false },
    { id: 8, name: 'Crosair', image: '', selected: false },
  ];

  constructor(
    private listingbyService: ListingByCatService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    // this.filterDebouncer.pipe(
    //   debounceTime(300), // Wait 300ms after last change
    //   distinctUntilChanged() // Only emit if value changed
    // ).subscribe(() => {
    //   this.executeFilter();
    // });
  //     this.filterDebouncer.pipe(
  //   debounceTime(300),
  //   distinctUntilChanged()
  // ).subscribe(() => {
  //   this.cdr.detectChanges(); // bach yrefresh l view
  // });

    this.filterDebouncer.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(() => {
    this.executeFilter(); // Add this line!
  });


    this.executeFilter();
    this.getPriceRange();
    this.getBrands();
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

  // get filteredModels() {
  //   if (!this.selectedBrand) return this.models;
  //   return this.models.filter(model => model.brandId === +this.selectedBrand);
  // }
  //   onSearch() {
  //   if (this.activeTab === 'model') {
  //     console.log('Searching by model:', {
  //       brand: this.selectedBrand,
  //       model: this.selectedModel,
  //       year: this.selectedYear
  //     });
  //     // Implement your search logic here
  //   } else {
  //     console.log('Searching by category:', {
  //       category: this.selectedCategory
  //     });
  //     // Implement your category search logic here
  //   }
  // }

  //   selectCategory(categoryId: number): void {
  //   this.categories.forEach(cat => {
  //     cat.selected = cat.id === categoryId;
  //   });
  //   this.selectedCategory = categoryId.toString();
  // }

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
    this.categories.forEach((cat) => (cat.selected = false));
  }

  selectCategory(categoryId: number) {
    this.categories.forEach((cat) => {
      cat.selected = cat.id === categoryId;
    });
    this.selectedCategory = categoryId.toString();
  }
  // Add these methods
  // onBrandSearchChange(event: any): void {
  //   this.brandSearchTerm = event.target.value;
  // }

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

  // Price range handlers
  // onMinSliderChange(event: any): void {
  //   this.priceRange.min = +event.target.value;
  //   this.triggerDebouncedFilter();
  // }

  // onMaxSliderChange(event: any): void {
  //   this.priceRange.max = +event.target.value;
  //   this.triggerDebouncedFilter();
  // }
//   onMinSliderChange(event: any): void {
//   const newValue = +event.target.value;
//   console.log('Min slider changed to:', newValue);
//   this.priceRange.min = newValue;
  
//   // Ensure min doesn't exceed max
//   if (this.priceRange.min > this.priceRange.max) {
//     this.priceRange.min = this.priceRange.max;
//   }
  
//   this.triggerDebouncedFilter();
// }

// onMaxSliderChange(event: any): void {
//   const newValue = +event.target.value;
//   console.log('Max slider changed to:', newValue);
//   this.priceRange.max = newValue;
  
//   // Ensure max doesn't go below min
//   if (this.priceRange.max < this.priceRange.min) {
//     this.priceRange.max = this.priceRange.min;
//   }
  
//   this.triggerDebouncedFilter();
// }



  onMinSliderChange(event: any) {
    this.priceRange.min = +event.target.value;
    // this.applyFilters();
        this.executeFilter();

  }

  onMaxSliderChange(event: any) {
    this.priceRange.max = +event.target.value;
    // this.applyFilters();
        this.executeFilter();

  }

    onMinInputChange() {
    if (this.priceRange.min < this.absoluteMin) {
      this.priceRange.min = this.absoluteMin;
    }
    if (this.priceRange.min > this.priceRange.max) {
      this.priceRange.min = this.priceRange.max;
    }
    // this.applyFilters();
    this.executeFilter();
  }

  onMaxInputChange() {
    if (this.priceRange.max > this.absoluteMax) {
      this.priceRange.max = this.absoluteMax;
    }
    if (this.priceRange.max < this.priceRange.min) {
      this.priceRange.max = this.priceRange.min;
    }
    // this.applyFilters();
        this.executeFilter();

  }

  // onMinInputChange(): void {
  //   if (this.priceRange.min < this.absoluteMin) {
  //     this.priceRange.min = this.absoluteMin;
  //   }
  //   if (this.priceRange.min > this.priceRange.max) {
  //     this.priceRange.min = this.priceRange.max;
  //   }
  //   this.triggerDebouncedFilter();
  // }

  // onMaxInputChange(): void {
  //   if (this.priceRange.max > this.absoluteMax) {
  //     this.priceRange.max = this.absoluteMax;
  //   }
  //   if (this.priceRange.max < this.priceRange.min) {
  //     this.priceRange.max = this.priceRange.min;
  //   }
  //   this.triggerDebouncedFilter();
  // }

  onBrandChangeFilter(): void {
    this.executeFilter();
  }

//   onBrandChangeFilter(brand: any, event: any): void {
//   brand.checked = event.target.checked; // update state

//   const selectedBrandIds = this.filteredBrands
//     .filter((b) => b.checked)
//     .map((b) => b.id);

//   // this.executeFilterWithBrands(selectedBrandIds);
// }
// executeFilterWithBrands(selectedBrandIds: number[]): void {
//   this.isLoading = true;

//   this.listingbyService
//     .filterMotorcycles({
//       min_price: this.priceRange.min,
//       max_price: this.priceRange.max,
//       brands: selectedBrandIds,
//       models: this.selectedModel ? [this.selectedModel] : [],
//       years: this.selectedYear ? [this.selectedYear] : [],
//       condition: this.selectedCondition,
//     })
//     .subscribe({
//       next: (response) => {
//         setTimeout(() => {
//           const motorcycles = response.motorcycles || response;
//           this.motorCyclesDetails = motorcycles.map((motorcycle: Motorcycle) => ({
//             ...motorcycle,
//             imageLoaded: false,
//           }));
//           this.isLoading = false;
//           this.cdr.detectChanges();
//           this.animateCards();
//         }, 300);
//       },
//       error: (error) => {
//         console.error('Error filtering motorcycles:', error);
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       },
//     });
// }

   triggerDebouncedFilter(): void {
    this.filterDebouncer.next();
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

  // onBrandChange(brandId: number) {
  //   this.selectedModel = '';
  //   this.selectedYear = '';
  //   this.filteredModels = [];
  //   this.filteredYears = [];

  //   if (brandId) {
  //     this.listingService.getMotorcycleModels(brandId).subscribe((res) => {
  //       this.models = res.data;
  //       this.filteredModels = res.data;
  //     });
  //   }
  //   this.executeFilter();
  // }

  // onModelChange(modelId: number) {
  //   this.selectedYear = '';
  //   this.filteredYears = [];

  //   if (modelId) {
  //     this.listingService.getMotorcycleYears(modelId).subscribe((res) => {
  //       this.years = res.data;
  //       this.filteredYears = res.data;
  //     });
  //   }
  //       this.executeFilter();
  // }

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

  // onYearChange(year: number) {
  //   this.executeFilter(); // مباشرة من بعد ما يختار year
  // }

//   onBrandSearchChange(event: any): void {
//   this.brandSearchTerm = event.target.value;
//   this.filterDebouncer.next();
// }

onBrandSearchChange(value: string): void {
  console.log('value',value);
  this.brandSearchTerm = value;
  this.filterDebouncer.next();
  this.cdr.detectChanges();
}
  // executeFilter(): void {
  //   this.isLoading = true;
  //      const selectedBrandIds = this.brands
  //     .filter((brand) => brand.checked)
  //     .map((brand) => brand.id);
  //   this.listingbyService
  //     .filterMotorcycles({
  //       min_price: this.priceRange.min,
  //       max_price: this.priceRange.max,
  //       // brands: selectedBrandIds,
  //       // models: selectedModelIds,
  //       // years:yearSelectedIds,
  //       brands: this.selectedBrand || selectedBrandIds ? [this.selectedBrand] : [],
  //       models: this.selectedModel ? [this.selectedModel] : [],
  //       years: this.selectedYear  ? [this.selectedYear] : [],
  //       condition: this.selectedCondition,
  //     })
  //     .subscribe({
  //       next: (response) => {
  //         // Add a small delay to show loading animation
  //         setTimeout(() => {
  //           const motorcycles = response.motorcycles || response;
  //           // Initialize imageLoaded property for each motorcycle
  //           this.motorCyclesDetails = motorcycles.map(
  //             (motorcycle: Motorcycle) => ({
  //               ...motorcycle,
  //               imageLoaded: false,
  //             })
  //           );

  //           this.isLoading = false;
  //           this.cdr.detectChanges();

  //           // Trigger staggered animation
  //           this.animateCards();
  //         }, 300); // Small delay to show loading state
  //       },
  //       error: (error) => {
  //         console.error('Error filtering motorcycles:', error);
  //         this.isLoading = false;
  //         this.cdr.detectChanges();
  //       },
  //     });
  // }

  onYearChange(yearValue: string ): void {
  this.selectedYear = yearValue;
  this.executeFilter();
}


// executeFilter(): void {
//   this.isLoading = true;

//   const selectedBrandIds = this.filteredBrands
//     .filter((brand) => brand.checked)
//     .map((brand) => brand.id);

//   this.listingbyService
//     .filterMotorcycles({
//       min_price: this.priceRange.min,
//       max_price: this.priceRange.max,
//       brands: selectedBrandIds.length ? selectedBrandIds : (this.selectedBrand ? [this.selectedBrand] : []),
//       models: this.selectedModel ? [this.selectedModel] : [],
//       years: this.selectedYear ? [this.selectedYear] : [],
//       condition: this.selectedCondition,
//     })
//     .subscribe({
//       next: (response) => {
//         setTimeout(() => {
//           const motorcycles = response.motorcycles || response;
//           this.motorCyclesDetails = motorcycles.map((m: Motorcycle) => ({
//             ...m,
//             imageLoaded: false,
//           }));
//           this.isLoading = false;
//           this.cdr.detectChanges();
//           this.animateCards();
//         }, 300);
//       },
//       error: (err) => {
//         console.error('Error filtering motorcycles:', err);
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       },
//     });
// }

executeFilter(): void {
  console.log('Executing filter with price range:', this.priceRange);
  this.isLoading = true;

  const selectedBrandIds = this.filteredBrands
    .filter((brand) => brand.checked)
    .map((brand) => brand.id);

  const filterParams = {
    min_price: this.priceRange.min,
    max_price: this.priceRange.max,
    brands: selectedBrandIds.length ? selectedBrandIds : (this.selectedBrand ? [this.selectedBrand] : []),
    models: this.selectedModel ? [this.selectedModel] : [],
    years: this.selectedYear ? [this.selectedYear] : [],
    condition: this.selectedCondition,
  };

  console.log('Filter params:', filterParams);

  this.listingbyService
    .filterMotorcycles(filterParams)
    .subscribe({
      next: (response) => {
        console.log('Filter response:', response);
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
      const cards = document.querySelectorAll('.product-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-fade-in-up');
        }, index * 100);
      });
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
