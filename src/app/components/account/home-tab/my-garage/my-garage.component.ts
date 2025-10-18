import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../../postingAdd/product-form/listingService/listing-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface GarageItem {
  id: number;
  user_id: number;
  brand_id: number;
  model_id: number;
  year_id: number;
  title: string | null;
  description: string | null;
  picture: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  brand: {
    id: number;
    name: string;
  };
  model: {
    id: number;
    name: string;
  };
  year: {
    id: number;
    year: number;
  };
}

@Component({
  selector: 'app-my-garage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './my-garage.component.html',
  styleUrl: './my-garage.component.css'
})
export class MyGarageComponent implements OnInit {
  vehicleForm: FormGroup;
  garageItems: GarageItem[] = [];
  showAddForm: boolean = false;
  isEditMode: boolean = false;
  editingItemId: number | null = null;

  // Data arrays
  brands: Array<{ id: number; name: string }> = [];
  models: Array<{ id: number; name: string }> = [];
  years: Array<{ id: number; year: number }> = [];

  // Search properties
  brandSearchTerm: string = '';
  modelSearchTerm: string = '';
  yearSearchTerm: string = '';

  // Filtered arrays
  filteredBrands: any[] = [];
  filteredModels: any[] = [];
  filteredYears: any[] = [];

  // Dropdown visibility
  showBrandDropdown: boolean = false;
  showModelDropdown: boolean = false;
  showYearDropdown: boolean = false;

   isLoading: boolean = true; // Add loading state

  constructor(
    private listingService: ListingService, 
    private fb: FormBuilder
  ) {
    this.vehicleForm = this.fb.group({
      brand_id: ['', Validators.required],
      model_id: ['', Validators.required],
      year_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadBrands();
    this.getMyGarage();
  }

  loadBrands() {
    this.listingService.getMotorcycleBrands().subscribe((res) => {
      this.brands = res.data;
      this.filteredBrands = res.data;
    });
  }

  filterBrands() {
    this.filteredBrands = this.brands.filter(brand =>
      brand.name.toLowerCase().includes(this.brandSearchTerm.toLowerCase())
    );
    this.showBrandDropdown = true;
  }

  filterModels() {
    this.filteredModels = this.models.filter(model =>
      model.name.toLowerCase().includes(this.modelSearchTerm.toLowerCase())
    );
    this.showModelDropdown = true;
  }

  filterYears() {
    this.filteredYears = this.years.filter(year =>
      year.year.toString().includes(this.yearSearchTerm)
    );
    this.showYearDropdown = true;
  }

  selectBrand(brand: any) {
    this.brandSearchTerm = brand.name;
    this.vehicleForm.patchValue({ brand_id: brand.id });
    this.showBrandDropdown = false;
    this.onBrandChange(brand.id);
  }

  selectModel(model: any) {
    this.modelSearchTerm = model.name;
    this.vehicleForm.patchValue({ model_id: model.id });
    this.showModelDropdown = false;
    this.onModelChange(model.id);
  }

  selectYear(year: any) {
    this.yearSearchTerm = year.year.toString();
    this.vehicleForm.patchValue({ year_id: year.id });
    this.showYearDropdown = false;
  }

  onBrandChange(brandId: number) {
    this.models = [];
    this.years = [];
    this.modelSearchTerm = '';
    this.yearSearchTerm = '';
    this.filteredModels = [];
    this.filteredYears = [];
    
    this.vehicleForm.patchValue({ model_id: '', year_id: '' });

    if (brandId) {
      this.listingService.getMotorcycleModels(brandId).subscribe((res) => {
        this.models = res.data;
        this.filteredModels = res.data;
      });
    }
  }

  onModelChange(modelId: number) {
    this.years = [];
    this.yearSearchTerm = '';
    this.filteredYears = [];
    
    this.vehicleForm.patchValue({ year_id: '' });

    if (modelId) {
      this.listingService.getMotorcycleYears(modelId).subscribe((res) => {
        this.years = res.data;
        this.filteredYears = res.data;
      });
    }
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showBrandDropdown = false;
      this.showModelDropdown = false;
      this.showYearDropdown = false;
    }
  }

  showAddVehicleForm() {
    this.isEditMode = false;
    this.editingItemId = null;
    this.showAddForm = true;
  }

  cancelAddVehicle() {
    this.showAddForm = false;
    this.isEditMode = false;
    this.editingItemId = null;
    this.vehicleForm.reset();
    this.brandSearchTerm = '';
    this.modelSearchTerm = '';
    this.yearSearchTerm = '';
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      console.log(this.vehicleForm.value);
      
      if (this.isEditMode && this.editingItemId) {
        // Update existing vehicle
        this.listingService.updateGarageItem(this.editingItemId, this.vehicleForm.value).subscribe({
          next: (res) => {
            console.log('Vehicle updated:', res);
            this.getMyGarage();
            this.resetForm();
          },
          error: (err) => {
            console.error('Error updating vehicle:', err);
            alert('Failed to update vehicle. Please try again.');
          }
        });
      } else {
        // Create new vehicle
        this.listingService.postMyGarage(this.vehicleForm.value).subscribe({
          next: (res) => {
            console.log('Vehicle saved:', res);
            this.getMyGarage();
            this.resetForm();
          },
          error: (err) => {
            console.error('Error saving vehicle:', err);
            alert('Failed to save vehicle. Please try again.');
          }
        });
      }
    }
  }

  resetForm() {
    this.vehicleForm.reset();
    this.brandSearchTerm = '';
    this.modelSearchTerm = '';
    this.yearSearchTerm = '';
    this.showAddForm = false;
    this.isEditMode = false;
    this.editingItemId = null;
  }

  getMyGarage() {
      this.isLoading = true; 
    this.listingService.getMyGarage().subscribe({
      next: (res) => {
        console.log('My Garage:', res);
        this.garageItems = res.data;
        console.log(' this.garageItems : ',  this.garageItems.length );
          this.isLoading = false; 
      },
      error: (err) => {
        console.error('Error fetching garage:', err);
          this.isLoading = false; 
      }
    });
  }

  deleteVehicle(id: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.listingService.deleteGarageItem(id).subscribe({
        next: (res) => {
          console.log('Vehicle deleted:', res);
          this.getMyGarage();
          alert('Vehicle deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting vehicle:', err);
          alert('Failed to delete vehicle. Please try again.');
        }
      });
    }
  }

  editVehicle(item: GarageItem) {
    this.isEditMode = true;
    this.editingItemId = item.id;
    this.showAddForm = true;
    
    // Load models and years for the selected brand and model
    this.onBrandChange(item.brand_id);
    
    // Wait a bit for models to load, then set model and load years
    setTimeout(() => {
      this.onModelChange(item.model_id);
      
      // Set form values
      this.vehicleForm.patchValue({
        brand_id: item.brand_id,
        model_id: item.model_id,
        year_id: item.year_id
      });
      
      this.brandSearchTerm = item.brand.name;
      this.modelSearchTerm = item.model.name;
      this.yearSearchTerm = item.year.year.toString();
    }, 500);
  }

  setAsDefault(id: number) {
    this.listingService.setDefaultGarageItem(id).subscribe({
      next: (res) => {
        console.log('Set as default:', res);
        this.getMyGarage();
        alert('Vehicle set as default successfully!');
      },
      error: (err) => {
        console.error('Error setting default:', err);
        alert('Failed to set vehicle as default. Please try again.');
      }
    });
  }

  // Helper method to check if a vehicle is default
  isDefault(item: GarageItem): boolean {
    return item.is_default === true;
  }
}