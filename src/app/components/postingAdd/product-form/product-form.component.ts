import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ListingService } from './listingService/listing-service.service';
import { title } from 'process';
import { SharedFormDataService } from '../../../services/shared-form-data.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormatFieldNamePipe } from './FormatFieldNamePipe';
import { Route, Router } from '@angular/router';

interface UploadedImage {
  preview: string;  // taswira 9bl ma tuploadi
  url: string | null; // lien mn server
  file: File;       // fichier original
}
interface ImageObject {
  preview: string;    // Base64 string for preview
  serverUrl: string | null;  // URL from server (null while uploading)
  file?: File;        // Original file object (optional)
}
interface Step {
  number: number;
  title: string;
  description: string;
}


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,TranslateModule, FormatFieldNamePipe],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  @Input() currentStep = 1;
  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadedImages: ImageObject[] = [];  // Array of image objects
  uploadedImageUrls: string[] = [];    // Just URLs for form submission
  maxImages = 10;
  requiredImages = 4;
  pricingInfo: any = null;


  promoCode: string = '';
isPromoApplied: boolean = false;
promoLoading: boolean = false;
promoError: string | null = null;
discountedPrice: number | null = null;



  vehicleFormData: any | null = null;
  vehicleForm!: FormGroup;
  adDetailsForm!: FormGroup;
  checkoutForm!: FormGroup;
  bikeForm!: FormGroup;

  postingAnAd!: FormGroup;
  maxSteps = 3;
  isSubmitting = false;
  submissionSuccess = false;
  submissionError = false;
  errorMessage = '';

  vehicleOptions = [
    {
      category_id: 1,
      id: 'motorcycle',
      name: 'Motorcycle',
      icon: 'motorcycle-icon',
      note: 'Fees depend on the type',
      imageUrl: '/pictures/motoIconPostingAdd.svg',
    },
    {
      category_id: 2,
      id: 'bike-part',
      name: 'Bike Part',
      icon: 'bike-part-icon',
      note: 'Fees depend on the type',
      imageUrl: '/pictures/usedpart.svg',
    },
    {
      category_id: 3,
      id: 'license-plate',
      name: 'License Plate',
      icon: 'license-plate-icon',
      note: 'SAR 300',
      imageUrl: '/pictures/licensePlate.svg',
    },
  ];

  uploadedFiles: File[] = [];

  iconPath = [
    { id: 'motorcycle', path: 'assets/icons/motorcycle.svg' },
    { id: 'bike-part', path: 'assets/icons/usedpart.svg' },
    { id: 'license-plate', path: 'assets/licensePlate.svg' },
  ];
  plateFormatOptions = [
    {type_id:1, id: 'numbers-alphabets', label: 'Numbers & Alphabets', selected: true },
    {type_id:2, id: 'numbers-only', label: 'Numbers Only', selected: false },
  ];

  brandsPart :any[] = [];
  partCategory: any[] = [];
  selectedVehicleType = 1;

  brands: Array<{ id: number; name: string }> = [];
  models: Array<{ id: number; name: string }> = [];
  years: Array<{ id: number; year: number }> = [];

  // allCities: Array<{ id: number; name: string; country_id: number }> = [];
  cities: Array<{ id: number; name: string; country_id: number }> = [];
  // countries: Array<{ id: number; name: string; code: string }> = [];

  bodyConditions = ['As New', 'Used', 'Needs some fixes'];
  partsConditions = ['New', 'Used'];
  vehicleCareOptions = ['Wakeel', 'USA', 'Europe', 'GCC', 'Customs License'];
  transmissionTypes = ['Automatic', 'Manual', 'Semi-Automatic'];
  steps = [
    {
      title: 'Filling Product Details',
      subtitle: 'Please provide your name and email',
    },
    {
      title: 'Ad & Contact Details',
      subtitle: 'Details needed for customers to contact you',
    },
    { title: 'Checkout', subtitle: 'Start collaborating with your team' },
  ];

  sellerTypeOptions = [
    { value: 'middleman', label: 'Middleman' },
    { value: 'owner', label: 'Selling your own vehicle' }
  ];
  selectedType: 'motorcycle' | 'bike-part' | 'license-plate' | null = null;

  cardDetails = {
    name: 'Olivia Rhye',
    expiry: '06 2024',
    number: '1234 1234 1234 1234',
    cvv: '***',
  };

  adFees = {
    original: 100,
    discounted: 90,
  };
  promocode = 'WELCOME10';
  promocodeApplied = true;

  paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', selected: true },
    { id: 'tamara', name: 'Tamara', selected: false, badge: 'tamara' },
    { id: 'tabby', name: 'Tabby', selected: false, badge: 'tabby' },
  ];


   platesForm: FormGroup;
  countries: any[] = [];
  allCities: any[] = [];
  filteredCities: any[] = [];
  dynamicFields: any[] = [];
  selectedPlateFormat: any = null;

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService,
    private sharedFormDataService: SharedFormDataService,
    private translate: TranslateService,
    private router : Router, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) 
  {
     this.translate.setDefaultLang('en');
    
    // Only set language preference on browser side
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use('en');
    }
    
    this.postingAnAd = this.fb.group({});
    this.vehicleForm = this.fb.group({
      category_id: [1, Validators.required],
      vehicleType: ['motorcycle', Validators.required],
      images: [], // images: [null,Validators.required],
      brand_id: ['', Validators.required],
      model_id: ['', Validators.required],
      year_id: ['', Validators.required],
      body_condition: ['As New', Validators.required],
      modified: ['No', Validators.required],
      insurance: ['Yes', Validators.required],
      general_condition: ['Used', Validators.required],
      vehicle_care: ['Wakeel', Validators.required],
      engine: ['', [Validators.required, Validators.min(1)]],
      mileage: ['', [Validators.required, Validators.min(0)]],
      transmission: ['Automatic', Validators.required],
    });

    this.bikeForm = this.fb.group({
      category_id: [2, Validators.required],
      images: [[]],
      bike_part_brand_id: [1, Validators.required],
      bike_part_category_id: [1, Validators.required],
      brand_id: ['1', Validators.required],
      model_id: ['2', Validators.required],
      year_id: ['1'],
      condition: ['new', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });

    this.platesForm = this.fb.group({
      type_id: [1, Validators.required],
      category_id: [3, Validators.required],
      plateFormat: ['numbers-alphabets', Validators.required],
      country_id_lp: [ , Validators.required],
      city_id_lp: [ , Validators.required],
      firstAlphabet: [null],
      secondAlphabet: [null],
      thirdAlphabet: [null],
   
    });


    this.adDetailsForm = this.fb.group({
      title: ['',[ Validators.required, Validators.minLength(5),Validators.maxLength(100),],],
      description: ['', [Validators.required, Validators.minLength(20)]],
      allow_submission: ['', Validators.required],
      contacting_channel: ['', Validators.required],
      price: [null, ],
      country: ['',Validators.required],
      city: ['', Validators.required],
      sellerType: ['', Validators.required],
      minimum_bid: [0] // Add this new field for Soom settings
    });

    this.checkoutForm = this.fb.group({
      agreeToTerms: [false, Validators.requiredTrue],
    });
  }

ngOnInit(): void {

  // this.onBrandChange();
  this.loadBrands();
  this.getPartCategoryList()
   this.getBrandPartList()
 this.initForm();
    this.loadCities();
    this.setupFormListeners();
  this.loadCitys();

  this.platesForm.get('country_id_lp')?.valueChanges.subscribe((countryId) => {
    this.onCountryChange(countryId);
  });

  this.platesForm.get('city_id_lp')?.valueChanges.subscribe((cityId) => {
    this.onCitySelected(cityId);
  });
}

initForm(): void {
  this.platesForm = this.fb.group({
    country_id_lp: [null, Validators.required],
    city_id_lp: [null, Validators.required],
    plate_format_id: [null, Validators.required],  // Added this
    // type_id: [1, Validators.required]
  });
}
allowOnlyDigits(event: KeyboardEvent, writingSystem: string = 'latin'): void {
  const inputChar = event.key;

  if (writingSystem === 'arabic') {
    const arabicDigitRegex = /^[\u0660-\u0669]+$/; // Arabic-Indic ٠-٩
    if (!arabicDigitRegex.test(inputChar)) {
      event.preventDefault();
    }
  } else {
    const latinDigitRegex = /^[0-9]+$/;
    if (!latinDigitRegex.test(inputChar)) {
      event.preventDefault();
    }
  }
}
allowOnlyLetters(event: KeyboardEvent, writingSystem: string = 'latin'): void {
  const inputChar = event.key;

  if (writingSystem === 'arabic') {
    const arabicLetterRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]+$/;
    if (!arabicLetterRegex.test(inputChar)) {
      event.preventDefault();
    }
  } else {
    // Default to Latin letters only
    const latinRegex = /^[a-zA-Z\s]+$/;
    if (!latinRegex.test(inputChar)) {
      event.preventDefault();
    }
  }
}

logFormStatus(): void {
  console.log('Form valid:', this.platesForm.valid);
  console.log('Form errors:', this.platesForm.errors);
  Object.keys(this.platesForm.controls).forEach(key => {
    const control = this.platesForm.get(key);
    console.log(`Control ${key}:`, {
      value: control?.value,
      valid: control?.valid,
      errors: control?.errors,
      touched: control?.touched
    });
  });
}
  loadCities(): void {
    this.listingService.getCityList().subscribe((res) => {
      this.countries = res.countries;
      this.allCities = res.cities;
    });
  }

  setupFormListeners(): void {
    this.platesForm.get('country_id_lp')?.valueChanges.subscribe((countryId) => {
      this.onCountryChange(countryId);
    });

    this.platesForm.get('city_id_lp')?.valueChanges.subscribe((cityId) => {
      if (cityId) this.onCitySelected(cityId);
    });
  }

  onCountryChange(countryId: number): void {
    if (!countryId) return;

    this.filteredCities = this.allCities.filter(city => city.country_id === +countryId);
    
    this.platesForm.patchValue({ city_id_lp: null });
    this.clearDynamicFields();
  }



  getControlName(field: any): string {
    // Create a unique control name using field ID to avoid conflicts
    return `${field.field_name}_${field.id}`;
  }
getValidatorsForField(field: any): ValidatorFn[] {
  const validators: ValidatorFn[] = [];

  if (field.is_required) {
    validators.push(Validators.required);
  }

  if (field.min_length) {
    validators.push(Validators.minLength(field.min_length));
  }

  if (field.max_length) {
    validators.push(Validators.maxLength(field.max_length));
  }

  // Add character validation pattern based on character type and writing system
  if (field.character_type === 'letter') {
    if (field.writing_system === 'latin') {
      validators.push(Validators.pattern(/^[a-zA-Z]*$/));
    } else if (field.writing_system === 'arabic') {
      validators.push(Validators.pattern(/^[\u0600-\u06FF\s]*$/));
    }
  } else if (field.character_type === 'digit') {
    if (field.writing_system === 'latin') {
      validators.push(Validators.pattern(/^[0-9]*$/));
    } else if (field.writing_system === 'arabic') {
      validators.push(Validators.pattern(/^[\u0660-\u0669]*$/)); // Arabic-Indic digits (١-٩)
    }
  }

  // Add custom regex if provided by the API
  if (field.validation_pattern) {
    validators.push(Validators.pattern(field.validation_pattern));
  }

  return validators;
}

  clearDynamicFields(): void {
    // Remove all dynamic field controls
    Object.keys(this.platesForm.controls).forEach(key => {
      if (!['country_id_lp', 'city_id_lp', 'plate_format_id', 'type_id'].includes(key)) {
        this.platesForm.removeControl(key);
      }
    });
    
    this.dynamicFields = [];
    this.selectedPlateFormat = null;
  }
  // getValidatorsForField(field: any): any[] {
  //   const validators = [];
    
  //   if (field.is_required) validators.push(Validators.required);
  //   if (field.min_length) validators.push(Validators.minLength(field.min_length));
  //   if (field.max_length) validators.push(Validators.maxLength(field.max_length));
    
  //   // Add pattern validation based on character type
  //   if (field.character_type === 'digit') {
  //     validators.push(Validators.pattern(/^[0-9]*$/));
  //   } else if (field.character_type === 'letter') {
  //     validators.push(Validators.pattern(/^[a-zA-Z]*$/));
  //   }
    
  //   // Add custom pattern if provided
  //   if (field.validation_pattern) {
  //     validators.push(Validators.pattern(field.validation_pattern));
  //   }
    
  //   return validators;
  // }




onCitySelected(cityId: number): void {
  this.clearDynamicFields();
  
  if (!cityId) {
    this.platesForm.get('city_id_lp')?.markAsTouched();
    return;
  }

  this.listingService.getPlateFormat(cityId).subscribe({
    next: (res) => {
      if (res.formats?.length > 0) {
        this.selectedPlateFormat = res.formats[0];
        this.dynamicFields = this.selectedPlateFormat.fields;
        
        // Store the format ID in the form
        this.platesForm.patchValue({
          plate_format_id: this.selectedPlateFormat.id,  // This is the ID you need
          type_id: this.selectedPlateFormat.type_id || 1 // Fallback to 1 if undefined
        });

        this.addDynamicFieldsToForm();
        
        this.platesForm.updateValueAndValidity();
      } else {
        this.selectedPlateFormat = null;
        this.platesForm.get('city_id_lp')?.setErrors({'noFormat': true});
      }
    },
    error: (err) => {
      console.error('Error fetching plate formats:', err);
      this.selectedPlateFormat = null;
      this.platesForm.get('city_id_lp')?.setErrors({'apiError': true});
    }
  });
}
// Modify the addDynamicFieldsToForm method
addDynamicFieldsToForm(): void {
  this.dynamicFields.forEach(field => {
    const controlName = this.getControlName(field);
    const validators = this.getValidatorsForField(field);

    if (!this.platesForm.contains(controlName)) {
      this.platesForm.addControl(controlName, new FormControl('', validators));
    } else {
      // Update validators if control already exists
      const control = this.platesForm.get(controlName);
      control?.setValidators(validators);
      control?.updateValueAndValidity();
    }

    field.controlName = controlName;
  });

  // Force form validation check
  this.platesForm.updateValueAndValidity();
}

// Add a method to check if all required fields are filled
allRequiredFieldsFilled(): boolean {
  // Check base required fields
  if (!this.platesForm.get('country_id_lp')?.value || 
      !this.platesForm.get('city_id_lp')?.value) {
    return false;
  }

  // Check dynamic fields
  return this.dynamicFields.every(field => {
    if (!field.is_required) return true;
    const value = this.platesForm.get(field.controlName)?.value;
    return value !== null && value !== undefined && value !== '';
  });
}

// Update the template to use this method for the Next button
loadCitys() {
  this.listingService.getCityList().subscribe((res) => {
    this.countries = res.countries;
    this.allCities = res.cities;
  });
}



updatePlateFormWithDynamicFields(fields: any[]) {
  // Make sure type_id and plateFormat exist first
  if (!this.platesForm.contains('type_id')) {
    this.platesForm.addControl('type_id', new FormControl('', Validators.required));
  }

  if (!this.platesForm.contains('plateFormat')) {
    this.platesForm.addControl('plateFormat', new FormControl('', Validators.required));
  }

  // Now you can safely patch
  this.platesForm.patchValue({
    plateFormat: this.selectedPlateFormat.id,
    type_id: this.selectedPlateFormat.type_id,
  });

  // Add dynamic fields
  this.dynamicFields = fields.map(field => {
    const controlName = `${field.field_name}_${field.id}`;
    const validators = [];

    if (field.is_required) validators.push(Validators.required);
    if (field.min_length) validators.push(Validators.minLength(field.min_length));
    if (field.max_length) validators.push(Validators.maxLength(field.max_length));
    if (field.validation_pattern) validators.push(Validators.pattern(field.validation_pattern));

    if (!this.platesForm.contains(controlName)) {
      this.platesForm.addControl(controlName, new FormControl('', validators));
    }

    return {
      ...field,
      controlName
    };
  });
}

generateDynamicPlateForm(fields: any[]) {
  const group: { [key: string]: FormControl } = {
    // Keep the existing form controls
    type_id: new FormControl(this.selectedPlateFormat?.type_id || null, Validators.required),
    country_id_lp: new FormControl(this.platesForm.get('country_id_lp')?.value, Validators.required),
    city_id_lp: new FormControl(this.platesForm.get('city_id_lp')?.value, Validators.required),
    category_id: new FormControl(3, Validators.required), // License plate category
    plateFormat: new FormControl(this.selectedPlateFormat?.id, Validators.required)
  };

  // Add dynamic fields based on API response
  fields.forEach(field => {
    const validators = [];
    
    if (field.is_required) {
      validators.push(Validators.required);
    }
    if (field.min_length) {
      validators.push(Validators.minLength(field.min_length));
    }
    if (field.max_length) {
      validators.push(Validators.maxLength(field.max_length));
    }
    if (field.validation_pattern) {
      validators.push(Validators.pattern(field.validation_pattern));
    }

    group[field.field_name] = new FormControl('', validators);
  });

  // Create new form group
  this.platesForm = new FormGroup(group);
  
  // Re-subscribe to city changes after form recreation
  this.platesForm.get('city_id_lp')?.valueChanges.subscribe((cityId) => {
    if (cityId && cityId !== this.platesForm.get('city_id_lp')?.value) {
      this.onCitySelected(cityId);
    }
  });
}

loadPlateForm(fields: any[]) {
  const group: any = {};
  fields.forEach(field => {
    const validators = [];

    if (field.is_required) validators.push(Validators.required);
    if (field.min_length) validators.push(Validators.minLength(field.min_length));
    if (field.max_length) validators.push(Validators.maxLength(field.max_length));
    if (field.validation_pattern) validators.push(Validators.pattern(field.validation_pattern));

    group[field.field_name] = new FormControl('', validators);
  });

  this.platesForm = new FormGroup(group);
}


  getBrandPartList(){
    this.listingService.getBrandPartList().subscribe((res) => {
      this.brandsPart = res.bike_part_brands;
      console.log('brandsPart:', this.brandsPart);
    });
  }
  getPartCategoryList(){
    this.listingService.getPartCategoryList().subscribe((res) => {
      this.partCategory = res.bike_part_categories;
      console.log('partCategory:', this.partCategory);
    });
  }
  // Add this method to check if Soom is selected
isSoomSelected(): boolean {
  return this.adDetailsForm.get('allow_submission')?.value === 'true';
}


  selectType(type: 'motorcycle' | 'bike-part' | 'license-plate') {
    this.selectedType = type;
    console.log('this.selectedType: ', this.selectedType);
  }
  highlightInvalidControls(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control && control.invalid) {
        console.warn(`Invalid control: ${key}`, control.errors);
      }
    });
  }

  goToStep(step: number) {
    this.currentStep = step;
  }
  createCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      agreeToTerms: [false, Validators.requiredTrue],
    });
  }
  // Custom validator to ensure at least one contact method is selected
  atLeastOneContactMethodValidator(
    group: FormGroup
  ): { [key: string]: boolean } | null {
    const direct = group.get('direct')?.value;
    const soom = group.get('soom')?.value;
    const phone = group.get('phone')?.value;
    const whatsapp = group.get('whatsapp')?.value;

    return direct || soom || phone || whatsapp
      ? null
      : { noContactMethod: true };
  }

  loadBrands() {
    this.listingService.getMotorcycleFilters().subscribe((res) => {
      this.brands = res.data.brands;
      console.log('Brands:', this.brands);
    });
  }

  onBrandChange(brandId: string) {
    this.models = [];
    this.years = [];
    this.vehicleForm.patchValue({ model_id: '', year_id: '' });
    this.bikeForm.patchValue({ model_id: '', year_id: '' });
    if (brandId) {
      this.listingService
        .getMotorcycleFilters({ brand_id: brandId })
        .subscribe((res) => {
          this.models = res.data.models;
        });
    }
  }

  get contactMethodsFormGroup(): FormGroup {
    return this.adDetailsForm.get('contactMethods') as FormGroup;
  }

  onModelChange(modelId: string) {
    this.years = [];
    this.vehicleForm.patchValue({ year_id: '' });
    this.bikeForm.patchValue({ year_id: '' });

    const brandId = this.vehicleForm.value.brand_id || this.bikeForm.value.brand_id;
    if (modelId && brandId) {
      this.listingService
        .getMotorcycleFilters({
          brand_id: brandId,
          model_id: modelId,
        })
        .subscribe((res) => {
          console.log('Years data:', res.data.years); // Check what you're receiving
          this.years = res.data.years.map((y: any) => ({
            id: y.id,
            year: y.year,
          }));
          console.log('Processed years:', this.years); // Verify the processed data
        });
    }
  }

handleFileInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files).slice(0, this.maxImages - this.uploadedImages.length);

  files.forEach((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newImage: ImageObject = {
        preview: reader.result as string,
        serverUrl: null,
        file: file
      };

      this.uploadedImages.push(newImage);
      this.uploadImage(newImage, this.uploadedImages.length - 1);
    };
    reader.readAsDataURL(file);
  });

  input.value = '';
}

uploadImage(image: ImageObject, index: number): void {
  if (!image.file) return;

  const formData = new FormData();
  formData.append('images[]', image.file);

  this.listingService.uploadImage(formData).subscribe({
    next: (response: {message: string, paths: string[]}) => {
      if (response.paths?.length) {
        // Update the image object with server URL
        this.uploadedImages[index].serverUrl = response.paths[0];

        // Update the URLs array for form submission
        this.uploadedImageUrls = this.uploadedImages
          .filter(img => img.serverUrl)
          .map(img => img.serverUrl) as string[];

        this.vehicleForm.patchValue({ images: this.uploadedImageUrls });
      }
    },
    error: (err) => {
      console.error('Upload error:', err);
      this.uploadedImages.splice(index, 1);
    }
  });
}

removeImage(index: number): void {
  this.uploadedImages.splice(index, 1);
  this.uploadedImageUrls = this.uploadedImages
    .filter(img => img.serverUrl)
    .map(img => img.serverUrl) as string[];

  this.vehicleForm.patchValue({ images: this.uploadedImageUrls });
}
  selectVehicleType(type: number): void {
    console.log('Received type:', type); // Check if this logs correctly
    this.selectedVehicleType = type;
    console.log('After assignment:', this.selectedVehicleType);
    // Only patch and reset if form exists
    this.vehicleForm?.patchValue({ category_id: type });
    this.vehicleForm?.patchValue({ vehicleType: type });

    if (this.selectedVehicleType === 1) {
      this.bikeForm?.reset();
      this.adDetailsForm?.reset();
      this.platesForm?.reset();
      this.checkoutForm?.reset();
    } else if (this.selectedVehicleType === 2) {
      this.vehicleForm?.reset();
      this.adDetailsForm?.reset();
      this.platesForm?.reset();
      this.checkoutForm?.reset();
    } else {
      this.bikeForm?.reset();
      this.adDetailsForm?.reset();
      this.vehicleForm?.reset();
      this.checkoutForm?.reset();
    }
  }

  selectBodyCondition(condition: string): void {
    this.vehicleForm.patchValue({ body_condition: condition });
  }

  selectModified(value: string): void {
    this.vehicleForm.patchValue({ modified: value });
  }

  selectInsurance(value: string): void {
    this.vehicleForm.patchValue({ insurance: value });
  }

  selectCondition(condition: string): void {
    this.vehicleForm.patchValue({ general_condition: condition });
  }

  selectVehicleCare(care: string): void {
    this.vehicleForm.patchValue({ vehicle_care: care });
  }

  selectTransmission(type: string): void {
    this.vehicleForm.patchValue({ transmission: type });
  }

  selectSellerType(type: string): void {
    this.adDetailsForm.patchValue({ sellerType: type });
  }

  toggleContactMethod(method: string): void {
    const contactMethods = this.adDetailsForm.get('contactMethods');
    const currentValue = contactMethods?.get(method)?.value;
    contactMethods?.get(method)?.setValue(!currentValue);
  }


  markCurrentFormTouched(): void {
    const form =
      this.currentStep === 1
        ? this.vehicleForm
        : this.currentStep === 2
        ? this.adDetailsForm
        : this.checkoutForm;

    form.markAllAsTouched();
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectPlateFormat(formatId: string, typeId: number): void {
    this.platesForm.get('plateFormat')?.setValue(formatId);
    this.platesForm.get('type_id')?.setValue(typeId); // Store the type_id

    // Your existing logic for handling format changes
    const alphaControls = ['firstAlphabet', 'secondAlphabet', 'thirdAlphabet'];
    if (formatId === 'numbers-only') {
      alphaControls.forEach((control) => {
        this.platesForm.get(control)?.reset();
        this.platesForm.get(control)?.clearValidators();
        this.platesForm.get(control)?.updateValueAndValidity();
      });
    } else {
      alphaControls.forEach((control) => {
        this.platesForm.get(control)?.setValidators(Validators.required);
        this.platesForm.get(control)?.updateValueAndValidity();
      });
    }
}
  onProductDetailsSubmit(formData: any) {
    console.log('Parent received form data:', formData);
    this.vehicleFormData = formData;
    // Only update the vehicle form if it exists
    if (this.vehicleForm) {
      this.vehicleForm.patchValue(formData);
    }
  }

// In your component where you need pricing
getPricing() {
  let pricingParams: any = {
    country_id: this.adDetailsForm.value.country_id // or wherever you store country_id
  };

  switch (this.selectedVehicleType) {
    case 1: // Motorcycle
      pricingParams.model_id = this.vehicleForm.value.model_id;
      pricingParams.category_id = 1;
      break;
    case 2: // Bike Part
      pricingParams.bike_part_category_id = this.bikeForm.value.bike_part_category_id;
      pricingParams.category_id = 2;
      break;
    case 3: // License Plate
      // Only country_id is needed
      pricingParams.category_id = 3;
      break;
  }

  this.listingService.getPricing(pricingParams).subscribe({
    next: (priceData) => {
      this.pricingInfo = priceData;
      console.log('this.pricingInfo: ', this.pricingInfo);
    },
    error: (err) => {
      console.error('Error fetching pricing:', err);
    }
  });
}

async goToNextStep() {
  try {
    switch (this.currentStep) {
      case 1: // Step 1: Vehicle-specific form
        await this.handleStep1();
        break;
        
      case 2: // Step 2: Ad details form
        await this.handleStep2();
        break;
        
      case 3: // Step 3: Final submission
        await this.handleStep3();
        break;
    }
  } catch (error) {
    console.error('Error in goToNextStep:', error);
    alert('An error occurred. Please try again.');
  }
}

private async handleStep1() {
  if (!this.validateStep1()) return;

  const step1Data = this.prepareStep1Data();
  if (!step1Data) return;

  this.sharedFormDataService.setStep1Data(step1Data);
  this.currentStep++;
}

private validateStep1(): boolean {

  // Type-specific form validation
  switch (this.selectedVehicleType) {
    case 1: 
      if (!this.vehicleForm.valid) {
        this.vehicleForm.markAllAsTouched();
        return false;
      }
      break;
      
    case 2:
      if (!this.bikeForm.valid) {
        this.bikeForm.markAllAsTouched();
        return false;
      }
      break;
      
    case 3:
      if (!this.platesForm.valid) {
        this.platesForm.markAllAsTouched();
        this.logFormErrors(this.platesForm);
        return false;
      }
      break;
  }

  return true;
}

private prepareStep1Data(): any {
  switch (this.selectedVehicleType) {
    case 1: // Motorcycle
      return {
        category_id: 1,
        vehicleType: 'motorcycle',
        brand_id: parseInt(this.vehicleForm.value.brand_id),
        model_id: parseInt(this.vehicleForm.value.model_id),
        year_id: parseInt(this.vehicleForm.value.year_id),
        engine: `${this.vehicleForm.value.engine}cc`,
        mileage: parseInt(this.vehicleForm.value.mileage),
        body_condition: this.vehicleForm.value.body_condition,
        modified: this.vehicleForm.value.modified === 'Yes',
        insurance: this.vehicleForm.value.insurance === 'Yes',
        general_condition: this.vehicleForm.value.general_condition,
        vehicle_care: this.vehicleForm.value.vehicle_care,
        transmission: this.vehicleForm.value.transmission,
        images: this.uploadedImageUrls.filter(url => url !== null)
      };

    case 2: // Bike Part
      return {
        category_id: 2,
        bike_part_brand_id: Number(this.bikeForm.value.bike_part_brand_id),
        bike_part_category_id: Number(this.bikeForm.value.bike_part_category_id),
        motorcycles: [{
          brand_id: parseInt(this.bikeForm.value.brand_id),
          model_id: parseInt(this.bikeForm.value.model_id),
          year_id: parseInt(this.bikeForm.value.year_id)
        }],
        condition: this.bikeForm.value.condition,
        description: this.bikeForm.value.description,
        images: this.uploadedImageUrls.filter(url => url !== null)
      };
      //     case 3: // License Plate (updated)
      // const dynamicFieldValues = this.dynamicFields.map(field => ({
      //   field_id: field.id,
      //   value: this.platesForm.value[field.controlName]
      // }));

      // return {
      //   category_id: 3,
      //   // type_id: this.platesForm.value.type_id,
      //   plate_format_id: this.selectedPlateFormat?.id,  // Changed from platesForm.value.plateFormat to selectedPlateFormat.id
      //   country_id_lp: Number(this.platesForm.value.country_id_lp),
      //   city_id_lp: Number(this.platesForm.value.city_id_lp),
      //   fields: dynamicFieldValues
      // };
case 3: // License Plate
  const dynamicFieldValues = this.dynamicFields.map(field => {
    // Convert value to string explicitly
    let fieldValue = this.platesForm.value[field.controlName];
    
    // Handle different value types
    if (fieldValue === null || fieldValue === undefined) {
      fieldValue = ''; // Default empty string
    } else if (typeof fieldValue === 'number') {
      fieldValue = fieldValue.toString();
    } else if (typeof fieldValue !== 'string') {
      fieldValue = String(fieldValue);
    }

    return {
      field_id: field.id,
      value: fieldValue // Now guaranteed to be a string
    };
  });

  return {
    category_id: 3,
    type_id: this.platesForm.value.type_id,
    plate_format_id: this.selectedPlateFormat?.id,
    country_id_lp: Number(this.platesForm.value.country_id_lp),
    city_id_lp: Number(this.platesForm.value.city_id_lp),
    fields: dynamicFieldValues
  };
    default:
      console.error('Unknown vehicle type:', this.selectedVehicleType);
      return null;
  }


}

private async handleStep2() {
  if (!this.adDetailsForm.valid) {
    this.adDetailsForm.markAllAsTouched();
    return;
  }

  const step2Data = {
    title: this.adDetailsForm.value.title,
    description: this.adDetailsForm.value.description,
    price: parseFloat(this.adDetailsForm.value.price),
    allow_submission: this.adDetailsForm.value.allow_submission === 'true',
    contacting_channel: this.adDetailsForm.value.contacting_channel,
    country_id: Number(this.adDetailsForm.value.country),
    city_id: parseInt(this.adDetailsForm.value.city),
    sellerType: this.adDetailsForm.value.sellerType,
    listing_type_id: 1,
    auction_enabled: this.adDetailsForm.value.allow_submission === 'true',
    minimum_bid: this.adDetailsForm.value.minimum_bid,
  };

  this.sharedFormDataService.setStep2Data(step2Data);
  this.currentStep++;

  try {
    const step1Data = this.sharedFormDataService.getStep1Data();
    const priceData = await this.getPricingInfo(step1Data, step2Data);
    this.pricingInfo = priceData;
    await this.buildAndSubmitPayload(step1Data, step2Data, priceData);
  } catch (error) {
    console.error('Error in pricing:', error);
    alert('Failed to get pricing information. Please try again.');
    this.currentStep--; // Go back if pricing fails
  }
}

private async handleStep3() {
  const step1Data = this.sharedFormDataService.getStep1Data();
  const step2Data = this.sharedFormDataService.getStep2Data();

  const payload = {
    // Common ad details
    title: step2Data.title,
    description: step2Data.description,
    price: step2Data.price,
    listing_type_id: step2Data.listing_type_id,
    city_id: step2Data.city_id,
    auction_enabled: step2Data.auction_enabled,
    minimum_bid: step2Data.minimum_bid,
    allow_submission: step2Data.allow_submission,
    contacting_channel: step2Data.contacting_channel,
    seller_type: step2Data.sellerType,
    // Type-specific details
    ...this.getTypeSpecificPayload(step1Data)
  };

  try {
    const res = await this.listingService.addPost(payload).toPromise();
    console.log('Ad created successfully:', res);
    this.currentStep++;
    this.router.navigate(['/home']);
  } catch (err) {
    console.error('Error creating ad:', err);
    alert('Failed to create ad. Please try again.');
  }
}

private getTypeSpecificPayload(step1Data: any): any {
  const basePayload = {
    images: this.uploadedImageUrls.filter(url => url !== null)
  };

  switch (this.selectedVehicleType) {
    case 1: // Motorcycle
      return {
        ...basePayload,
        category_id: step1Data.category_id,
        type_id: step1Data.type_id,
        brand_id: step1Data.brand_id,
        model_id: step1Data.model_id,
        year_id: step1Data.year_id,
        engine: step1Data.engine,
        mileage: step1Data.mileage,
        body_condition: step1Data.body_condition,
        modified: step1Data.modified,
        insurance: step1Data.insurance,
        general_condition: step1Data.general_condition,
        vehicle_care: step1Data.vehicle_care,
        transmission: step1Data.transmission
      };

    case 2: // Bike Part
      return {
        ...basePayload,
        category_id: step1Data.category_id,
        bike_part_brand_id: step1Data.bike_part_brand_id,
        bike_part_category_id: step1Data.bike_part_category_id,
        motorcycles: step1Data.motorcycles,
        condition: step1Data.condition
      };

    case 3: // License Plate
      return {
        ...basePayload,
        type_id: step1Data.type_id,
        category_id: step1Data.category_id,
        plate_format_id: step1Data.plate_format_id,
        country_id_lp: step1Data.country_id_lp,
        city_id_lp: step1Data.city_id_lp,
        fields: step1Data.fields
      };

    default:
      return basePayload;
  }
}

private logFormErrors(form: FormGroup) {
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    if (control?.errors) {
      console.log(`Field ${key} errors:`, control.errors);
    }
  });
}

  private getPricingInfo(step1Data: any, step2Data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const pricingParams: any = {
        country_id: step2Data.country_id || 3, // Default to 1 if not provided
      };

      switch (this.selectedVehicleType) {
        case 1: // Motorcycle
          pricingParams.model_id = step1Data.model_id;
          pricingParams.category_id = 1;
          break;
        case 2: // Bike Part
          pricingParams.model_id = step1Data.bike_part_category_id;
          pricingParams.category_id = 2;
          break;
        case 3: // License Plate
          pricingParams.category_id = 3;
          break;
      }

      this.listingService.getPricing(pricingParams).subscribe({
        next: (priceData) => {
          resolve(priceData);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  private buildAndSubmitPayload(step1Data: any, step2Data: any, priceData?: any) {
    let payload: any = {
      // Common ad details
      title: step2Data.title,
      description: step2Data.description,
      price: step2Data.price, // Use pricing API value if available
      listing_type_id: step2Data.listing_type_id,
      city_id: step2Data.city_id,
      auction_enabled: step2Data.auction_enabled,
      minimum_bid: step2Data.minimum_bid,
      allow_submission: step2Data.allow_submission,
      contacting_channel: step2Data.contacting_channel,
      seller_type: step2Data.sellerType,
    };

    // Add vehicle/item-specific fields
    switch (this.selectedVehicleType) {
      case 1: // Motorcycle
        payload = {
          ...payload,
          category_id: step1Data.category_id,
          type_id: step1Data.type_id,
          brand_id: step1Data.brand_id,
          model_id: step1Data.model_id,
          year_id: step1Data.year_id,
          engine: step1Data.engine,
          mileage: step1Data.mileage,
          body_condition: step1Data.body_condition,
          modified: step1Data.modified,
          insurance: step1Data.insurance,
          general_condition: step1Data.general_condition,
          vehicle_care: step1Data.vehicle_care,
          transmission: step1Data.transmission,
          images: this.uploadedImageUrls.filter(url => url !== null)
        };
        break;

      case 2: // Bike Part
        payload = {
          ...payload,
          category_id: step1Data.category_id,
          bike_part_brand_id: step1Data.bike_part_brand_id,
          bike_part_category_id: step1Data.bike_part_category_id,
          motorcycles: step1Data.motorcycles,
          condition: step1Data.condition,
          images: this.uploadedImageUrls.filter(url => url !== null)
        };
        break;

      case 3: // License Plate
        payload = {
          ...payload,
          type_id: step1Data.type_id,
          category_id: step1Data.category_id,
          plateFormatOptions: step1Data.plateFormatOptions,
          country_id_lp: Number(step1Data.country_id_lp),
          city_id_lp: Number(step1Data.city_id_lp),
          first_letter: step1Data.firstAlphabet,
          second_letter: step1Data.secondAlphabet,
          third_letter: step1Data.thirdAlphabet,
          digits_count: step1Data.digits_count,
        };
        delete payload.brand_id;
        delete payload.model_id;
        delete payload.year_id;
        break;
    }

    // Submit to API

  }

  removePromocode() {
    this.promocode = '';
    this.promocodeApplied = false;
    this.adFees.discounted = this.adFees.original;
  }

  selectPaymentMethod(id: string) {
    this.paymentMethods.forEach((method) => {
      method.selected = method.id === id;
    });
  }

  applyPromoCode() {
    if (!this.promoCode || !this.pricingInfo) return;

    this.promoLoading = true;
    this.promoError = null;

    const requestBody = {
      code: this.promoCode,
      total_price: parseFloat(this.pricingInfo.converted_price)
    };

    this.listingService.checkPromo(requestBody).subscribe({
      next: (response) => {
        this.isPromoApplied = true;
        this.discountedPrice = response.new_price; // Adjust based on actual API response
        console.log(' this.discountedPrice: ',  this.discountedPrice);
        this.promoLoading = false;
      },
      error: (err) => {
        this.promoError = err.error?.message || 'Invalid promo code';
        this.isPromoApplied = false;
        this.promoLoading = false;
      }
    });
  }

  // Method to remove promo code
  removePromoCode() {
    this.promoCode = '';
    this.isPromoApplied = false;
    this.discountedPrice = null;
    this.promoError = null;
  }
}




//   async goToNextStep() {
//     // Step 1: Vehicle-specific form
//     if (this.currentStep === 1) {
//       let isValid = false;
//       let step1Data: any;

//       switch (this.selectedVehicleType) {
//         case 1: // Motorcycle
//           isValid = this.vehicleForm.valid;
//           step1Data = {
//             category_id: 1,
//             // type_id: 1,
//             vehicleType: 'motorcycle',
//             brand_id: parseInt(this.vehicleForm.value.brand_id),
//             model_id: parseInt(this.vehicleForm.value.model_id),
//             year_id: parseInt(this.vehicleForm.value.year_id),
//             engine: this.vehicleForm.value.engine + 'cc', // Add "cc" suffix
//             mileage: parseInt(this.vehicleForm.value.mileage),
//             body_condition: this.vehicleForm.value.body_condition,
//             modified: this.vehicleForm.value.modified === 'Yes',
//             insurance: this.vehicleForm.value.insurance === 'Yes',
//             general_condition: this.vehicleForm.value.general_condition,
//             vehicle_care: this.vehicleForm.value.vehicle_care,
//             transmission: this.vehicleForm.value.transmission,
//             // images: this.uploadedImageUrls, // Use actual URLs
//             images: this.uploadedImageUrls.filter(url => url !== null)
//           };
//           if (!isValid) {
//             this.vehicleForm.markAllAsTouched();
//             if (this.uploadedImageUrls.length < 4) {
//               alert('Please upload at least 4 images');
//             }
//           }
//           break;
//         case 2: // Bike Part
//           isValid = this.bikeForm.valid;
//           step1Data = {
//             category_id: 2,
//             bike_part_brand_id: Number(this.bikeForm.value.bike_part_brand_id),
//             bike_part_category_id: Number(this.bikeForm.value.bike_part_category_id),
//             motorcycles: [{
//               brand_id: parseInt(this.bikeForm.value.brand_id),
//               model_id: parseInt(this.bikeForm.value.model_id),
//               year_id: parseInt(this.bikeForm.value.year_id)
//             }],
//             condition: this.bikeForm.value.condition,
//             description: this.bikeForm.value.description,
//             // ...this.bikeForm.value,
//             images: this.uploadedImageUrls.filter(url => url !== null)
//           };
//           // if (!this.bikeForm.valid) this.bikeForm.markAllAsTouched();
//           if (!isValid) {
//             this.bikeForm.markAllAsTouched();
//             if (this.uploadedImageUrls.length < 4) {
//               alert('Please upload at least 4 images');
//             }
//           }
//           break;

//   case 3: // License Plate
//   isValid = this.platesForm.valid;

// //   // Collect dynamic field values
// //   const dynamicFieldValues: { [key: string]: any } = {};
// //   // this.dynamicFields.forEach(field => {
// //   //   dynamicFieldValues[field.field_name] = this.platesForm.value[field.field_name];
// //   // });
// //   this.dynamicFields.forEach(field => {
// //   dynamicFieldValues[field.controlName] = this.platesForm.value[field.controlName];
// // });
// const dynamicFieldValues: { field_id: number, value: string }[] = [];

// this.dynamicFields.forEach(field => {
//   dynamicFieldValues.push({
//     field_id: field.id,
//     value: this.platesForm.value[field.controlName]
//   });
// });

// step1Data = {
//   category_id: 3,
//   type_id: this.platesForm.value.type_id,
//   plate_format_id: this.platesForm.value.plateFormat,
//   country_id_lp: Number(this.platesForm.value.country_id_lp),
//   city_id_lp: Number(this.platesForm.value.city_id_lp),
//   fields: dynamicFieldValues
// };

//   // step1Data = {
//   //   category_id: 3,
//   //   type_id: this.platesForm.value.type_id,
//   //   plateFormatId: this.platesForm.value.plateFormat,
//   //   country_id_lp: Number(this.platesForm.value.country_id_lp),
//   //   city_id_lp: Number(this.platesForm.value.city_id_lp),
//   //   ...dynamicFieldValues
//   // };

//   if (!isValid) {
//     this.platesForm.markAllAsTouched();
//     console.log('License plate form errors:', this.platesForm.errors);
//     // Log individual field errors for debugging
//     Object.keys(this.platesForm.controls).forEach(key => {
//       const control = this.platesForm.get(key);
//       if (control && control.errors) {
//         console.log(`Field ${key} errors:`, control.errors);
//       }
//     });
//   }
//   break;

//       }

//       if (isValid) {
//         this.sharedFormDataService.setStep1Data(step1Data);
//         console.log('step1Data: ', step1Data);
//         this.currentStep++;
//       }
//     } else if (this.currentStep === 2) {
//       if (this.adDetailsForm.valid) {
//         const step2Data = {
//           title: this.adDetailsForm.value.title,
//           description: this.adDetailsForm.value.description,
//           price: parseFloat(this.adDetailsForm.value.price),
//           allow_submission:this.adDetailsForm.value.allow_submission === 'true',
//           contacting_channel: this.adDetailsForm.value.contacting_channel,
//           country_id:Number(this.platesForm.value.country),
//           city_id: parseInt(this.adDetailsForm.value.city),
//           sellerType: this.adDetailsForm.value.sellerType,
//           listing_type_id: 1,

//           auction_enabled: this.adDetailsForm.value.allow_submission === 'true',
//           minimum_bid: this.adDetailsForm.value.minimum_bid,
//         };

//         this.sharedFormDataService.setStep2Data(step2Data); // Save for step 3
//         const step1Data = this.sharedFormDataService.getStep1Data();
//         console.log('Step Data 2',step2Data);
//         this.currentStep++;

//         this.getPricingInfo(step1Data, step2Data).then(priceData => {
//           // Then build and submit the final payload
//           this.pricingInfo = priceData;
//           console.log(' this.pricingInfo: ',  this.pricingInfo);
//           console.log('priceData ',priceData);
//           this.buildAndSubmitPayload(step1Data, step2Data, priceData);
//         }).catch(error => {
//           console.error('Error getting pricing:', error);
//           alert('Failed to get pricing information. Please try again.');
//         });

//       } else {
//         this.adDetailsForm.markAllAsTouched();
//       }

//   } else if (this.currentStep === 3) {
//     const step1Data = this.sharedFormDataService.getStep1Data();
//     const step2Data = this.sharedFormDataService.getStep2Data();
//     let payload: any = {
//       // Common ad details
//       title: step2Data.title,
//       description: step2Data.description,
//       price: step2Data.price, // Use pricing API value if available
//       listing_type_id: step2Data.listing_type_id,
//       city_id: step2Data.city_id,
//       auction_enabled: step2Data.auction_enabled,
//       minimum_bid: step2Data.minimum_bid,
//       allow_submission: step2Data.allow_submission,
//       contacting_channel: step2Data.contacting_channel,
//       seller_type: step2Data.sellerType,
//     };

//     // Add vehicle/item-specific fields
//     switch (this.selectedVehicleType) {
//       case 1: // Motorcycle
//         payload = {
//           ...payload,
//           category_id: step1Data.category_id,
//           type_id: step1Data.type_id,
//           brand_id: step1Data.brand_id,
//           model_id: step1Data.model_id,
//           year_id: step1Data.year_id,
//           engine: step1Data.engine,
//           mileage: step1Data.mileage,
//           body_condition: step1Data.body_condition,
//           modified: step1Data.modified,
//           insurance: step1Data.insurance,
//           general_condition: step1Data.general_condition,
//           vehicle_care: step1Data.vehicle_care,
//           transmission: step1Data.transmission,
//           images: this.uploadedImageUrls.filter(url => url !== null)
//         };
//         break;

//       case 2: // Bike Part
//         payload = {
//           ...payload,
//           category_id: step1Data.category_id,
//           bike_part_brand_id: step1Data.bike_part_brand_id,
//           bike_part_category_id: step1Data.bike_part_category_id,
//           motorcycles: step1Data.motorcycles,
//           condition: step1Data.condition,
//           images: this.uploadedImageUrls.filter(url => url !== null)
//         };
//         break;

//       case 3: // License Plate
//         payload = {
//           ...payload,
//           type_id: step1Data.type_id,
//           category_id: step1Data.category_id,
//           // plateFormatOptions: step1Data.plateFormatOptions,
//           // country_id_lp: Number(step1Data.country_id_lp),
//           // city_id_lp: Number(step1Data.city_id_lp),
//           // first_letter: step1Data.firstAlphabet,
//           // second_letter: step1Data.secondAlphabet,
//           // third_letter: step1Data.thirdAlphabet,
//           // digits_count: step1Data.digits_count,
//           plate_format_id: step1Data.plate_format_id,
//           country_id_lp: step1Data.country_id_lp,
//           city_id_lp: step1Data.city_id_lp,
//           fields: step1Data.fields,
//         };
//         delete payload.brand_id;
//         delete payload.model_id;
//         delete payload.year_id;
//         break;
//     }
//     this.listingService.addPost(payload).subscribe({
//       next: (res) => {
//         console.log('Ad created successfully:', res);
//         this.currentStep++;
//       },
//       error: (err) => {
//         console.error('Error creating ad:', err);
//         alert('Failed to create ad. Please try again.');
//       },
//     });

//   }
//   }


// Step 2: Ad details
// else if (this.currentStep === 2) {
//   if (this.adDetailsForm.valid) {
//     const step2Data = {
//       title: this.adDetailsForm.value.title,
//       description: this.adDetailsForm.value.description,
//       price: parseFloat(this.adDetailsForm.value.price),
//       allow_submission: this.adDetailsForm.value.allow_submission === 'true',
//       contacting_channel: this.adDetailsForm.value.contacting_channel,
//       city_id: parseInt(this.adDetailsForm.value.city),
//       sellerType: this.adDetailsForm.value.sellerType,
//       category_id: 1,
//       country_id: 1,
//       auction_enabled: false,
//       minimum_bid: 0
//     };

//     const step1Data = this.sharedFormDataService.getStep1Data();

//     // Create final payload matching your desired format
//     const payload = {
//       // Ad details
//       title: step2Data.title,
//       description: step2Data.description,
//       price: step2Data.price,
//       category_id: step2Data.category_id,
//       country_id: step2Data.country_id,
//       city_id: step2Data.city_id,
//       auction_enabled: step2Data.auction_enabled,
//       minimum_bid: step2Data.minimum_bid,
//       allow_submission: step2Data.allow_submission,

//       // Vehicle details
//       listing_type_id: step1Data.listing_type_id,
//       brand_id: step1Data.brand_id,
//       model_id: step1Data.model_id,
//       year_id: step1Data.year_id,
//       type_id: step1Data.type_id,
//       engine: step1Data.engine,
//       mileage: step1Data.mileage,
//       body_condition: step1Data.body_condition,
//       modified: step1Data.modified,
//       insurance: step1Data.insurance,
//       general_condition: step1Data.general_condition,
//       vehicle_care: step1Data.vehicle_care,
//       transmission: step1Data.transmission,
//       images: step1Data.images
//     };

//     console.log('Final payload:', payload);

//     // Submit the payload
//     this.listingService.addPost(payload).subscribe({
//       next: (res) => {
//         console.log('Ad created successfully:', res);
//         this.currentStep++;
//       },
//       error: (err) => {
//         console.error('Error creating ad:', err);
//         alert('Failed to create ad. Please try again.');
//       }
//     });
//     this.currentStep++;
//   } else {
//     this.adDetailsForm.markAllAsTouched();
//   }
// }

// nextStep() {
//   // This now only handles step 2
//   console.log('clicked');
//   if (this.currentStep === 2 && this.adDetailsForm.valid) {
//     // const adDetailsForm = this.adDetailsFormComponent.form;
//     // this.adDetailsFormComponent.markAllAsTouched();
//     this.currentStep++
//     console.log('adDetails',this.adDetailsForm.value);

//     // if (adDetailsForm.valid) {
//     //   this.submitForm();
//     // }
//   }
// }



        // case 3: // License Plate
        //   isValid = this.platesForm.valid;
        //   step1Data = {
        //     category_id: 3,
        //     type_id: this.platesForm.value.type_id,
        //     plateFormatOptions: this.platesForm.value.plateFormat,
        //     country_id_lp:Number(this.platesForm.value.country_id_lp),
        //     city_id_lp: Number(this.platesForm.value.city_id_lp),
        //     firstAlphabet: this.platesForm.value.firstAlphabet,
        //     secondAlphabet: this.platesForm.value.secondAlphabet,
        //     thirdAlphabet: this.platesForm.value.thirdAlphabet,
        //     digits_count: this.platesForm.value.digits_count,

        //   };
        //   if (!isValid) {
        //     this.platesForm.markAllAsTouched();
        //   }
        //   break;