import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ListingByCatService } from '../services/listingsByCategory/listing-by-cat.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ListingService } from '../components/postingAdd/product-form/listingService/listing-service.service';


interface Brand {
  id: number;
  name: string;
  listings_count: number;
  checked?: boolean; // optional property for the checkbox state
}

interface bikePart {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  image?: string;
  imageLoaded?: boolean; // Add this for image loading state
  // add other properties as needed
}
@Component({
  selector: 'app-spare-plates-details',
   standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './spare-plates-details.component.html',
  styleUrls: ['./spare-plates-details.component.css', '../components/sidebar/sidebar.component.css']
})
export class SparePlatesDetailsComponent implements OnInit{


  isDigitsOpen: boolean = true;
  isCountryOpen: boolean = true;
  isPlateCodeOpen: boolean = true;
  digits = [
    { value: 'new', count: 18, checked: false },
    { value: 'sale', count: 22, checked: false },
    { value: 'DabApp Exclusives', count: 23, checked: false }
  ];
  brands: Brand[] = [];


selectedCondition: 'new' | 'used' | '' = '';

 bikePartsDetails: any
   priceRange = { min: 0, max: 0 };
   absoluteMin = 0;
   absoluteMax = 0;
   isLoading = false;
   private filterDebouncer = new Subject<void>();

  isCategoryOpen = true;

    activeTab: 'model' | 'category' = 'model';
 selectedBrand: string = '';
  selectedModel: string = '';
  selectedYear: string = '';
   selectedCategory = '';
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


 bikePartsBrand: any[] = [];
  bikePartsCatg: any[] = [];
  spareParts :any

  searchBrandTerm = '';
searchCategoryTerm = '';
displayCount = 6;

filteredModels: any[] = [];
filteredYears: any[] = [];

 models: any[] = [];
  years: any[] = [];

  constructor(private listingbyService :ListingByCatService, private router :Router,private cdr: ChangeDetectorRef, private listingService: ListingService){}

  // Update your applyFilters method
// Replace your current applyFilters and executeFilter methods with these:

private buildFilterParams(): any {
  const params: any = {};
  
  // Price range
  if (this.priceRange.min > 0) {
    params.min_price = this.priceRange.min;
  }
  if (this.priceRange.max > this.priceRange.min) {
    params.max_price = this.priceRange.max;
  }
  
  // Condition
  if (this.selectedCondition) {
    params.condition = this.selectedCondition;
  }
  
  // Selected brands
  const selectedBrands = this.bikePartsBrand.filter(b => b.checked).map(b => b.id);
  if (selectedBrands.length > 0) {
    params.bike_part_brands = selectedBrands;
  }
  
  // Selected categories
  const selectedCategories = this.bikePartsCatg.filter(c => c.checked).map(c => c.id);
  if (selectedCategories.length > 0) {
    params.bike_part_categories = selectedCategories;
  }
  const selectedBrandIds = this.filteredBrands
    .filter((brand) => brand.checked)
    .map((brand) => brand.id);
    params.brands = this.selectedBrand ? [this.selectedBrand] : selectedBrandIds;
    params.models = this.selectedModel ? [this.selectedModel] : [];
    params.years = this.selectedYear ? [this.selectedYear] : [];


  
  return params;
}

applyFilters() {
  this.isLoading = true;
  this.filterDebouncer.next(); // Trigger the debounced filter
}

 executeFilter() {
  const params = this.buildFilterParams(); // Now this method exists
  
  this.listingbyService.filterSpareParts(params).subscribe(
    (response) => {
      this.spareParts = response.spare_parts || response;
      console.log(' this.spareParts: ',  this.spareParts);
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    (error) => {
      console.error('Filter error:', error);
      this.isLoading = false;
    }
  );
}
  trackBySparePartsId(index: number, sparePart: any): number {
    return sparePart.id;
  }

  trackByPartId(index: number, bike: bikePart): number {
    return bike.id;
  }
  ngOnInit(): void {
   this.filterDebouncer.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(() => {
    this.executeFilter(); // Now properly connected
  });
  this.executeFilter();
  this.getBrands();
  this.getBikePartsBrand();
  this.getBikePartCatg();
  this.getPriceRange();

     // this.getSparePlates();
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

    onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    const motorcycleIndex = this.bikePartsCatg.findIndex(m => m.image === img.src);
    if (motorcycleIndex !== -1) {
      this.bikePartsCatg[motorcycleIndex].imageLoaded = true;
      this.cdr.detectChanges();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Set a placeholder image or handle error
    // img.src = 'assets/images/motorcycle-placeholder.jpg'; // Add your placeholder image
    const motorcycleIndex = this.bikePartsCatg.findIndex(m => m.image === img.src);
    if (motorcycleIndex !== -1) {
      this.bikePartsCatg[motorcycleIndex].imageLoaded = true;
      this.cdr.detectChanges();
    }
  }

  // getSparePlates(){
  //   this.listingbyService.getBikePartByCategory().subscribe((res :any) =>{
  //     this.spareParts = res;
  //     console.log('this.spareParts: ', this.spareParts);
  //   })
  // }

     truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
    this.categories.forEach((cat) => (cat.selected = false));
  }

 
  getBikePartsBrand() {
    this.listingbyService.getBikePartsBrand().subscribe((res: any) => {
      this.bikePartsBrand = res.bike_part_brands.map((brand: any) => ({
        ...brand,
        checked: false
      }));
    });
  }

  getBikePartCatg() {
    this.listingbyService.getBikePartCatg().subscribe((res: any) => {
      this.bikePartsCatg = res.bike_part_categories.map((cat: any) => ({
        ...cat,
        checked: false
      }));
    });
  }

    onYearChange(yearValue: string ): void {
  this.selectedYear = yearValue;
  this.executeFilter();
}
 selectCategory(categoryId: number) {
    this.categories.forEach((cat) => {
      cat.selected = cat.id === categoryId;
    });
    this.selectedCategory = categoryId.toString();
  }

  getPriceRange() {
  this.listingbyService.getPriceRange(2).subscribe({
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
  


  // Toggle methods
  toggleDigits() {
    this.isDigitsOpen = !this.isDigitsOpen;
  }

  toggleCountry() {
    this.isCountryOpen = !this.isCountryOpen;
  }

  toggleCategory() {
    this.isCategoryOpen = !this.isCategoryOpen;
  }

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

  viewListing(id: number): void {
  this.router.navigate(['/listing', id]);
}
  // Filter application
  // applyFilters() {
  //   const params: any = {};
    
  //   // Price range
  //   if (this.priceRange.min !== this.absoluteMin) {
  //     params.min_price = this.priceRange.min;
  //   }
  //   if (this.priceRange.max !== this.absoluteMax) {
  //     params.max_price = this.priceRange.max;
  //   }
    
  //   // Condition
  //   if (this.selectedCondition) {
  //     params.condition = this.selectedCondition;
  //   }
    
  //   // Selected brands
  //   const selectedBrands = this.bikePartsBrand.filter(b => b.checked).map(b => b.id);
  //   if (selectedBrands.length > 0) {
  //     params.bike_part_brands = selectedBrands;
  //   }
    
  //   // Selected categories
  //   const selectedCategories = this.bikePartsCatg.filter(c => c.checked).map(c => c.id);
  //   if (selectedCategories.length > 0) {
  //     params.bike_part_categories = selectedCategories;
  //   }
    
  //   // Call API with filters
  //   this.listingbyService.filterSpareParts(params).subscribe(
  //     (response) => {
  //       // Handle the filtered response (update your listings display)
  //       console.log('Filtered results:', response);
  //     },
  //     (error) => {
  //       console.error('Filter error:', error);
  //     }
  //   );
  // }

  // Called when brand selection changes
  onBrandChangecheck() {
    // this.applyFilters();
    this.executeFilter();
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


  // Called when category selection changes
  onCategoryChange() {
    // this.applyFilters();
    this.executeFilter();
  }

  get filteredBrands() {
  return this.bikePartsBrand
    .filter(brand => brand.name.toLowerCase().includes(this.searchBrandTerm.toLowerCase()))
    .slice(0, this.displayCount);
}

get filteredCategories() {
  return this.bikePartsCatg
    .filter(category => category.name.toLowerCase().includes(this.searchCategoryTerm.toLowerCase()))
    .slice(0, this.displayCount);
}

// Method to load more items
showMoreBrands() {
  this.displayCount += 6;
}

showMoreCategories() {
  this.displayCount += 6;
}
}
 // getBikePartsBrand(){
  //   this.listingbyService.getBikePartsBrand().subscribe((res: any)=>{
  //     this.bikePartsBrand = res
  //     console.log(' this.bikePartsBrand: ',  this.bikePartsBrand);
  //   })
  // }

  //  getBikePartCatg(){
  //   this.listingbyService.getBikePartCatg().subscribe((res: any)=>{
  //     this.bikePartsCatg = res
  //     console.log(' this.bikePartsCatg: ',  this.bikePartsCatg);
  //   })
  // }


  // toggleDigits() {
  //   this.isDigitsOpen = !this.isDigitsOpen;
  // }

  // toggleCountry() {
  //   this.isCountryOpen = !this.isCountryOpen;
  // }

  // togglePlateCode() {
  //   this.isPlateCodeOpen = !this.isPlateCodeOpen;
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

  //    executeFilter(): void {
//   this.isLoading = true;
  
//   const selectedBrandIds = this.brands
//     .filter(brand => brand.checked)
//     .map(brand => brand.id);

//   this.listingbyService.filterMotorcycles({
//     min_price: this.priceRange.min,
//     max_price: this.priceRange.max,
//     brands: selectedBrandIds,
//     condition: this.selectedCondition
//   }).subscribe({
//     next: (response) => {
//       this.bikePartsDetails = response.motorcycles || response;
//       console.log('this.motorCyclesDetails: ', this.bikePartsDetails);
//       this.isLoading = false;
//       this.cdr.detectChanges();
//     },
//     error: (error) => {
//       console.error('Error filtering motorcycles:', error);
//       this.isLoading = false;
//     }
//   });
// }

  // countries = [
  //   { code: 'KSA', name: 'KSA', count: 18, checked: false },
  //   { code: 'UAE', name: 'UAE', count: 32, checked: false },
  //   { code: 'Kuwait', name: 'Kuwait', count: 23, checked: false },
  //   { code: 'Bahrain', name: 'Bahrain', count: 23, checked: false }
  // ];

  // plateCodes = [
  //   { value: 'A', count: 9, checked: false },
  //   { value: 'B', count: 17, checked: false },
  //   { value: 'C', count: 50, checked: false },
  //   { value: 'D', count: 6, checked: false }
  // ];