import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ListingByCatService } from '../services/listingsByCategory/listing-by-cat.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface Motorcycle {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  image?: string;
  imageLoaded?: boolean; // Add this for image loading state
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
export class MotorcyclesDetailsComponent implements OnInit, OnDestroy {
  isDigitsOpen: boolean = true;
  isCountryOpen: boolean = true;
  isPlateCodeOpen: boolean = true;

  digits = [
    { value: 'new', count: 18, checked: false },
    { value: 'Used', count: 22, checked: false },
    { value: 'DabApp Exclusives', count: 23, checked: false }
  ];

  brands: Brand[] = [];
  plateCodes = [
    { value: 'A', count: 9, checked: false },
    { value: 'B', count: 17, checked: false },
    { value: 'C', count: 50, checked: false },
    { value: 'D', count: 6, checked: false }
  ];

  selectedCondition: 'new' | 'used' | '' = '';
  motorCyclesDetails: Motorcycle[] = [];
  selectedBrands: number[] = [];
  priceRange = { min: 0, max: 0 };
  absoluteMin = 0;
  absoluteMax = 0;
  isLoading = false;
  private filterDebouncer = new Subject<void>();

  constructor(
    private listingbyService: ListingByCatService,  
    private cdr: ChangeDetectorRef,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.filterDebouncer.pipe(
      debounceTime(300), // Wait 300ms after last change
      distinctUntilChanged() // Only emit if value changed
    ).subscribe(() => {
      this.executeFilter();
    });

    this.executeFilter();
    this.getPriceRange();
    this.getBrands();
  }

    viewListing(id: number): void {
  this.router.navigate(['/listing', id]);
  console.log('click');
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
    const motorcycleIndex = this.motorCyclesDetails.findIndex(m => m.image === img.src);
    if (motorcycleIndex !== -1) {
      this.motorCyclesDetails[motorcycleIndex].imageLoaded = true;
      this.cdr.detectChanges();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Set a placeholder image or handle error
    img.src = 'assets/images/motorcycle-placeholder.jpg'; // Add your placeholder image
    const motorcycleIndex = this.motorCyclesDetails.findIndex(m => m.image === img.src);
    if (motorcycleIndex !== -1) {
      this.motorCyclesDetails[motorcycleIndex].imageLoaded = true;
      this.cdr.detectChanges();
    }
  }

  // Price range handlers
  onMinSliderChange(event: any): void {
    this.priceRange.min = +event.target.value;
    this.triggerDebouncedFilter();
  }

  onMaxSliderChange(event: any): void {
    this.priceRange.max = +event.target.value;
    this.triggerDebouncedFilter();
  }

  onMinInputChange(): void {
    if (this.priceRange.min < this.absoluteMin) {
      this.priceRange.min = this.absoluteMin;
    }
    if (this.priceRange.min > this.priceRange.max) {
      this.priceRange.min = this.priceRange.max;
    }
    this.triggerDebouncedFilter();
  }

  onMaxInputChange(): void {
    if (this.priceRange.max > this.absoluteMax) {
      this.priceRange.max = this.absoluteMax;
    }
    if (this.priceRange.max < this.priceRange.min) {
      this.priceRange.max = this.priceRange.min;
    }
    this.triggerDebouncedFilter();
  }

  onBrandChange(): void {
    // No debounce for brand changes as they're discrete clicks
    this.executeFilter();
  }

  private triggerDebouncedFilter(): void {
    this.filterDebouncer.next();
  }

  getBrands(): void {
    this.listingbyService.getBrandsListing().subscribe((res: { motorcycle_brands: Brand[] }) => {
      this.brands = res.motorcycle_brands.map(brand => ({
        ...brand,
        checked: false // initialize checked property
      }));
      console.log('this.brands: ', this.brands);
    });
  }

  getMotorcyclesdetails(): void {
    this.listingbyService.getMotorcyclesByCategory().subscribe((response: any) => {
      this.motorCyclesDetails = response;
    });
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
        // Add a small delay to show loading animation
        setTimeout(() => {
          const motorcycles = response.motorcycles || response;
          // Initialize imageLoaded property for each motorcycle
          this.motorCyclesDetails = motorcycles.map((motorcycle: Motorcycle) => ({
            ...motorcycle,
            imageLoaded: false
          }));
          
          console.log('this.motorCyclesDetails: ', this.motorCyclesDetails);
          this.isLoading = false;
          this.cdr.detectChanges();
          
          // Trigger staggered animation
          this.animateCards();
        }, 300); // Small delay to show loading state
      },
      error: (error) => {
        console.error('Error filtering motorcycles:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
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