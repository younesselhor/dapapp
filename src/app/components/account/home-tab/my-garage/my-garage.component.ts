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
  type_id: number;
  title: string | null;
  description: string | null;
  picture: string | null;
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
  type: {
    id: number;
    name: string;
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
  showAddForm: boolean = false; // Controls form visibility

  // Data arrays
  brands: Array<{ id: number; name: string }> = [];
  models: Array<{ id: number; name: string }> = [];
  years: Array<{ id: number; year: number }> = [];
  types: Array<{ id: number; name: string; description: string | null }> = [];

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

  constructor(
    private listingService: ListingService, 
    private fb: FormBuilder
  ) {
    this.vehicleForm = this.fb.group({
      type_id: ['', Validators.required],
      brand_id: ['', Validators.required],
      model_id: ['', Validators.required],
      year_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadBrands();
    this.getMyGarage();
    this.getTypes();
  }

  getTypes() {
    this.listingService.getTypes().subscribe((res) => {
      this.types = res.motorcycle_types; 
    });
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

  // Show the add vehicle form
  showAddVehicleForm() {
    this.showAddForm = true;
  }

  // Cancel adding vehicle and go back
  cancelAddVehicle() {
    this.showAddForm = false;
    this.vehicleForm.reset();
    this.brandSearchTerm = '';
    this.modelSearchTerm = '';
    this.yearSearchTerm = '';
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      console.log(this.vehicleForm.value);
      
      this.listingService.postMyGarage(this.vehicleForm.value).subscribe({
        next: (res) => {
          console.log('Vehicle saved:', res);
          this.getMyGarage();
          // Reset form and hide it after successful submission
          this.vehicleForm.reset();
          this.brandSearchTerm = '';
          this.modelSearchTerm = '';
          this.yearSearchTerm = '';
          this.showAddForm = false;
        },
        error: (err) => {
          console.error('Error saving vehicle:', err);
        }
      });
    }
  }

  getMyGarage() {
    this.listingService.getMyGarage().subscribe({
      next: (res) => {
        console.log('My Garage:', res);
        this.garageItems = res.data;
      },
      error: (err) => {
        console.error('Error fetching garage:', err);
      }
    });
  }

  deleteVehicle(id: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      // Implement delete API call here
      console.log('Delete vehicle:', id);
      // After successful deletion:
      // this.getMyGarage();
    }
  }

  editVehicle(item: GarageItem) {
    // Implement edit functionality
    console.log('Edit vehicle:', item);
    // Populate form with item data
    this.showAddForm = true;
    this.vehicleForm.patchValue({
      type_id: item.type_id,
      brand_id: item.brand_id,
      model_id: item.model_id,
      year_id: item.year_id
    });
    this.brandSearchTerm = item.brand.name;
    this.modelSearchTerm = item.model.name;
    this.yearSearchTerm = item.year.year.toString();
  }

  setAsDefault(id: number) {
    // Implement set as default functionality
    console.log('Set as default:', id);
  }
}