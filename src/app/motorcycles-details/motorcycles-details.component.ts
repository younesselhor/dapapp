import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ListingByCatService } from '../services/listingsByCategory/listing-by-cat.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
interface Motorcycle {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './motorcycles-details.component.html',
  styleUrls: ['./motorcycles-details.component.css', '../components/sidebar/sidebar.component.css']
})
export class MotorcyclesDetailsComponent implements OnInit {
  isDigitsOpen: boolean = true;
  isCountryOpen: boolean = true;
  isPlateCodeOpen: boolean = true;

  digits = [
    { value: 'new', count: 18, checked: false },
    { value: 'Used', count: 22, checked: false },
    { value: 'DabApp Exclusives', count: 23, checked: false }
  ];

  // countries = [
  //   { code: 'KSA', name: 'KSA', count: 18, checked: false },
  //   { code: 'UAE', name: 'UAE', count: 32, checked: false },
  //   { code: 'Kuwait', name: 'Kuwait', count: 23, checked: false },
  //   { code: 'Bahrain', name: 'Bahrain', count: 23, checked: false }
  // ];

  brands: Brand[] = [];
  plateCodes = [
    { value: 'A', count: 9, checked: false },
    { value: 'B', count: 17, checked: false },
    { value: 'C', count: 50, checked: false },
    { value: 'D', count: 6, checked: false }
  ];
selectedCondition: 'new' | 'used' | '' = '';
  motorCyclesDetails: any
  selectedBrands: number[] = [];
  // selectedCondition: string = '';
  priceRange = { min: 0, max: 0 };
  absoluteMin = 0;
  absoluteMax = 0;
  isLoading = false;
  private filterDebouncer = new Subject<void>();
  constructor(private listingbyService: ListingByCatService,  private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {

    this.filterDebouncer.pipe(
    debounceTime(300), // Wait 300ms after last change
    distinctUntilChanged() // Only emit if value changed
  ).subscribe(() => {
    this.executeFilter();
  });

    // this.getMotorcyclesdetails();
    this.executeFilter();
    this.getPriceRange();
    this.getBrands();
  }


  trackByMotorcycleId(index: number, motorcycle: Motorcycle): number {
  return motorcycle.id;
}
  // Modify your change handlers to use the debouncer
// onMinSliderChange(event: any): void {
//   this.priceRange.min = event.target.valueAsNumber || event.target.value;
//   this.filterDebouncer.next();
// }

// onMaxSliderChange(event: any): void {
//   this.priceRange.max = event.target.valueAsNumber || event.target.value;
//   this.filterDebouncer.next();
// }

// onMinInputChange(): void {
//   this.filterDebouncer.next();
// }

// onMaxInputChange(): void {
//   this.filterDebouncer.next();
// }
  // Price range handlers
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

onBrandChange(): void {
  // No debounce for brand changes as they're discrete clicks
  this.executeFilter();
}

getBrands() {
  this.listingbyService.getBrandsListing().subscribe((res: { motorcycle_brands: Brand[] }) => {
    this.brands = res.motorcycle_brands.map(brand => ({
      ...brand,
      checked: false // initialize checked property
    }));
    console.log('this.brands: ', this.brands);
  });
}
  getMotorcyclesdetails() {
    this.listingbyService.getMotorcyclesByCategory().subscribe((response: any) => {
      this.motorCyclesDetails = response
    })
  }

 executeFilter(): void {
  this.isLoading = true;
  
  const selectedBrandIds = this.brands
    .filter(brand => brand.checked)
    .map(brand => brand.id);

  this.listingbyService.filterMotorcycles({
    min_price: this.priceRange.min,
    max_price: this.priceRange.max,
    brands: selectedBrandIds,
    condition: this.selectedCondition
  }).subscribe({
    next: (response) => {
      this.motorCyclesDetails = response.motorcycles || response;
      console.log('this.motorCyclesDetails: ', this.motorCyclesDetails);
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error filtering motorcycles:', error);
      this.isLoading = false;
    }
  });
}

//    executeFilter(): void {
//   this.isLoading = true;
  
//   const selectedBrandIds = this.brands
//     .filter(brand => brand.checked)
//     .map(brand => brand.id);

//   const params = {
//     min_price: this.priceRange.min,
//     max_price: this.priceRange.max,
//     brands: selectedBrandIds,
//     condition: this.selectedCondition
//   };

//   this.listingbyService.filterMotorcycles(params).subscribe({
//     next: (response) => {
//       this.motorCyclesDetails = response;
//       console.log(' this.motorCyclesDetailsfilter: ',  this.motorCyclesDetails);
//       this.isLoading = false;
//     },
//     error: (error) => {
//       console.error('Error filtering motorcycles:', error);
//       this.isLoading = false;
//     }
//   });
// }



//   onFilterChange(): void {
//   this.isLoading = true;
  
//   // Get selected brand IDs
//   const selectedBrandIds = this.brands
//     .filter(brand => brand.checked)
//     .map(brand => brand.id);

//   // Prepare query parameters
//   const params = {
//     min_price: this.priceRange.min,
//     max_price: this.priceRange.max,
//     brands: selectedBrandIds,
//     condition: this.selectedCondition
//   };

//   // Call the API with filters
//   this.listingbyService.filterMotorcycles(params).subscribe({
//     next: (response) => {
//       this.motorCyclesDetails = response;
//       this.isLoading = false;
//     },
//     error: (error) => {
//       console.error('Error filtering motorcycles:', error);
//       this.isLoading = false;
//     }
//   });
// }



  // Add these to track the actual min/max from API

  // getPriceRange() {
  //   this.listingbyService.getPriceRange(1).subscribe((res: any) => {
  //     this.absoluteMin = res.min_price; // 900 from your example
  //     this.absoluteMax = res.max_price; // 7899 from your example

  //     // Initialize the current range with absolute values
  //     this.priceRange.min = this.absoluteMin;
  //     this.priceRange.max = this.absoluteMax;
  //   });
  // }
getPriceRange() {
  this.listingbyService.getPriceRange(1).subscribe({
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
      this.executeFilter();
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
      this.executeFilter();
    }
  });
}


  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }



  toggleDigits() {
    this.isDigitsOpen = !this.isDigitsOpen;
  }

  toggleCountry() {
    this.isCountryOpen = !this.isCountryOpen;
  }

  togglePlateCode() {
    this.isPlateCodeOpen = !this.isPlateCodeOpen;
  }
// ngOnDestroy() {
//   this.filterDebouncer.complete();
// }

  // onMinSliderChange(event: any) {
  //   const value = parseInt(event.target.value);
  //   // Ensure min doesn't exceed max
  //   if (value > this.priceRange.max) {
  //     this.priceRange.min = this.priceRange.max;
  //   } else {
  //     this.priceRange.min = value;
  //   }
  // }

  // onMaxSliderChange(event: any) {
  //   const value = parseInt(event.target.value);
  //   // Ensure max doesn't go below min
  //   if (value < this.priceRange.min) {
  //     this.priceRange.max = this.priceRange.min;
  //   } else {
  //     this.priceRange.max = value;
  //   }
  // }

  // onMinInputChange() {
  //   // Validate min input
  //   if (this.priceRange.min < 0) {
  //     this.priceRange.min = 0;
  //   } else if (this.priceRange.min > 1000) {
  //     this.priceRange.min = 1000;
  //   }

  //   // Ensure min doesn't exceed max
  //   if (this.priceRange.min > this.priceRange.max) {
  //     this.priceRange.max = this.priceRange.min;
  //   }
  // }

  // onMaxInputChange() {
  //   // Validate max input
  //   if (this.priceRange.max < 0) {
  //     this.priceRange.max = 0;
  //   } else if (this.priceRange.max > 1000) {
  //     this.priceRange.max = 1000;
  //   }

  //   // Ensure max doesn't go below min
  //   if (this.priceRange.max < this.priceRange.min) {
  //     this.priceRange.min = this.priceRange.max;
  //   }
  // }

  ngOnDestroy() {
  this.filterDebouncer.complete();
}
}

