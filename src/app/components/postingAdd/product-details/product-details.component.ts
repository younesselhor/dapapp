import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListingService } from '../product-form/listingService/listing-service.service';

@Component({
  selector: 'app-product-details',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  // @Output() formSubmitted = new EventEmitter<any>();
  @Input() currentStep = 1;
  @Output() formSubmitted = new EventEmitter<any>();
@Output() nextStepRequested = new EventEmitter<void>();

vehicleFormData: any

  vehicleForm!: FormGroup;
  bikeForm!: FormGroup;
  platesForm!: FormGroup;
  selectedVehicleType = 1;
  vehicleOptions = [
    { listing_type_id:1,id: 'motorcycle', name: 'Motorcycle', icon: 'motorcycle-icon', note: 'Fees depend on the type', imageUrl: '/pictures/motoIconPostingAdd.svg' },
    { listing_type_id:2 ,id: 'bike-part', name: 'Bike Part', icon: 'bike-part-icon', note: 'Fees depend on the type', imageUrl: '/pictures/usedpart.svg' },
    { listing_type_id:3,id: 'license-plate', name: 'License Plate', icon: 'license-plate-icon', note: 'SAR 300', imageUrl: '/pictures/licensePlate.svg' }
  ];
  brands: Array<{ id: number; name: string }> = [];
  models: Array<{ id: number; name: string }> = [];
  years: Array<{ id: number; year: number }> = [];

  bodyConditions = ['As New', 'Used', 'Needs some fixes'];
  partsConditions = ['New', 'Used'];
  vehicleCareOptions = ['Wakeel', 'USA', 'Europe', 'GCC', 'Customs License'];
  transmissionTypes = ['Automatic', 'Manual', 'Semi-Automatic'];

  plateFormatOptions = [
    { id: 'numbers-alphabets', label: 'Numbers & Alphabets', selected: true },
    { id: 'numbers-only', label: 'Numbers Only', selected: false }
  ];

  countries = [
    { id: 'uae', name: 'United Arab Emirates' },
    { id: 'qatar', name: 'Qatar' },
    { id: 'ksa', name: 'Saudi Arabia' }
  ];

  cities = [
    { id: 'dubai', countryId: 'uae', name: 'Dubai' },
    { id: 'abudhabi', countryId: 'uae', name: 'Abu Dhabi' },
    { id: 'sharjah', countryId: 'uae', name: 'Sharjah' },
    { id: 'alain', countryId: 'uae', name: 'Al Ain' },
    { id: 'ajman', countryId: 'uae', name: 'Ajman' },
    { id: 'doha', countryId: 'qatar', name: 'Doha' },
    { id: 'alrayyan', countryId: 'qatar', name: 'Al Rayyan' },
    { id: 'ummsalal', countryId: 'qatar', name: 'Umm Salal' },
    { id: 'alwakrah', countryId: 'qatar', name: 'Al Wakrah' },
    { id: 'alkhor', countryId: 'qatar', name: 'Al Khor' },
    { id: 'riyadh', countryId: 'ksa', name: 'Riyadh' },
    { id: 'jeddah', countryId: 'ksa', name: 'Jeddah' },
    { id: 'mecca', countryId: 'ksa', name: 'Mecca' },
    { id: 'medina', countryId: 'ksa', name: 'Medina' },
    { id: 'dammam', countryId: 'ksa', name: 'Dammam' }
  ];

  uploadedImages: string[] = [];
  maxImages = 10;
  constructor(private fb: FormBuilder, private listingService: ListingService){
    this.vehicleForm = this.fb.group({
      listing_type_id: [1, Validators.required],
      vehicleType: ['motorcycle', Validators.required],
      images: [[],],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      modelYear: ['', Validators.required],
      bodyCondition: ['As New', Validators.required],
      isModified: ['No', Validators.required],
      hasInsurance: ['Yes', Validators.required],
      condition: ['Used', Validators.required],
      vehicleCare: ['Wakeel', Validators.required],
      engineCapacity: ['', [Validators.required, Validators.min(1)]],
      kilometer: ['', [Validators.required, Validators.min(0)]],
      transmission: ['Automatic', Validators.required]
    });

    this.bikeForm = this.fb.group({
      listing_type_id: [2, Validators.required],
      images: [[],],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      modelYear: ['', Validators.required],
      condition: ['new', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });

    this.platesForm = this.fb.group({
      listing_type_id: [3, Validators.required],
      plateFormat: ['numbers-alphabets', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      country:['', Validators.required],
      city:['', Validators.required],
      firstAlphabet:[''],
      secondAlphabet:[''],
      thirdAlphabet:[''],
      plateNumbers:['']
    });
  }
ngOnInit(): void {
  this.loadBrands();
}
get form() {
  return this.vehicleForm;
}
loadBrands() {
  this.listingService.getMotorcycleFilters().subscribe(res => {
    this.brands = res.data.brands;
  });
}
selectVehicleType(type: number): void {
  this.selectedVehicleType = type;
  this.vehicleForm.patchValue({ listing_type_id: type });
  this.vehicleForm.patchValue({ vehicleType: type });
}
onBrandChange(brandId: string) {
  this.models = [];
  this.years = [];
  this.vehicleForm.patchValue({ model: '', modelYear: '' });

  if (brandId) {
    this.listingService.getMotorcycleFilters({ brand_id: brandId }).subscribe(res => {
      this.models = res.data.models;
    });
  }
}

onModelChange(modelId: string) {
  this.years = [];
  this.vehicleForm.patchValue({ modelYear: '' });

  const brandId = this.vehicleForm.value.brand;
  if (modelId && brandId) {
    this.listingService.getMotorcycleFilters({
      brand_id: brandId,
      model_id: modelId
    }).subscribe(res => {
      this.years = res.data.years.map((y: any) => ({
        id: y.id,
        year: y.year
      }));
    });
  }
}

selectBodyCondition(condition: string): void {
  this.vehicleForm.patchValue({ bodyCondition: condition });
}

selectModified(value: string): void {
  this.vehicleForm.patchValue({ isModified: value });
}

selectInsurance(value: string): void {
  this.vehicleForm.patchValue({ hasInsurance: value });
}

selectCondition(condition: string): void {
  this.vehicleForm.patchValue({ condition: condition });
}

selectVehicleCare(care: string): void {
  this.vehicleForm.patchValue({ vehicleCare: care });
}

selectTransmission(type: string): void {
  this.vehicleForm.patchValue({ transmission: type });
}

selectPlateFormat(formatId: string): void {
  this.vehicleForm.get('plateFormat')?.setValue(formatId);

  // Your existing logic for handling format changes
  const alphaControls = ['firstAlphabet', 'secondAlphabet', 'thirdAlphabet'];
  if (formatId === 'numbers-only') {
    alphaControls.forEach(control => {
      this.vehicleForm.get(control)?.reset();
      this.vehicleForm.get(control)?.clearValidators();
      this.vehicleForm.get(control)?.updateValueAndValidity();
    });
  } else {
    alphaControls.forEach(control => {
      this.vehicleForm.get(control)?.setValidators(Validators.required);
      this.vehicleForm.get(control)?.updateValueAndValidity();
    });
  }
}
handleFileInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files).slice(0, this.maxImages - this.uploadedImages.length);
  const currentImages = this.vehicleForm.get('images')?.value || [];

  files.forEach(file => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.uploadedImages.push(base64);
      currentImages.push(base64);

      // Update the form control
      this.vehicleForm.get('images')?.setValue(currentImages);
    };
    reader.readAsDataURL(file);
  });

  input.value = '';
}

removeImage(index: number): void {
  const currentImages = this.vehicleForm.get('images')?.value || [];
  this.uploadedImages.splice(index, 1);
  currentImages.splice(index, 1);
  this.vehicleForm.get('images')?.setValue(currentImages);
}


// In ProductFormComponent
onProductDetailsSubmit(formData: any) {
  this.vehicleFormData = formData;
  this.vehicleForm.patchValue(formData);
}

goToNextStep() {
  this.currentStep++;
}

previousStep(): void {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
}

nextStep() {


  // Log validation status for each control
  Object.keys(this.vehicleForm.controls).forEach(key => {
    const control = this.vehicleForm.get(key);
  });

  if (this.vehicleForm.valid) {
    this.formSubmitted.emit(this.vehicleForm.value);
    this.nextStepRequested.emit();
  } else {
    this.vehicleForm.markAllAsTouched();
  }
}



}
