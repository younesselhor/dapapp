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
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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

interface PlateFieldValue {
  plate_format_field_id: number;
  field_value: string;
}

interface FormatField {
  id: number;
  field_name: string;
  is_required: boolean;
  min_length?: number;
  max_length?: number;
  character_type?: string;
  writing_system?: string;
  validation_pattern?: string;
  // Add other properties as needed from API
}

interface FieldValue {
  plate_format_field_id: number;
  field_value: string;
  format_field: FormatField;
}

interface DynamicField extends FormatField {
  controlName: string;
}

interface PaymentMethod {
  type: 'card' | 'tamara' | 'tabby';
  id?: number; // For card payments, this will be the card ID
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
      imageUrl: '/pictures/Remarquespart.svg',
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
    { id: 'bike-part', path: 'assets/icons/Remarquespart.svg' },
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

  bodyConditions = ['As New', 'Remarques', 'Needs some fixes'];
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


  
  draftLicensePlateFieldValues: any[] = [];

  platesForm: FormGroup;
  countries: any[] = [];
  allCities: any[] = [];
  filteredCities: any[] = [];
  dynamicFields: any[] = [];
  selectedPlateFormat: any = null;
  listingId: number | null = null;

  user: any | null = null;
  isLoadingDraft = false;

  selectedPaymentMethod: PaymentMethod | null = null;
showAddCardForm = false;


// brands: any[] = [];
//   models: any[] = [];
//   years: any[] = [];
  
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
    private fb: FormBuilder,
    private listingService: ListingService,
    private sharedFormDataService: SharedFormDataService,
    private translate: TranslateService,
    private router : Router, 
    private route: ActivatedRoute,
    private userService: AuthService,
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
      bike_part_brand_id: ['', Validators.required],
      bike_part_category_id: ['', Validators.required],
      brand_id: ['', Validators.required],
      model_id: ['', Validators.required],
      year_id: [''],
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
      contacting_channel: [''],
      price: [null, ],
      country: ['',Validators.required],
      city: ['', Validators.required],
      seller_type: ['', Validators.required],
      minimum_bid: [0] // Add this new field for Soom settings
    });

    this.checkoutForm = this.fb.group({
      agreeToTerms: [false, Validators.requiredTrue],
    });


      document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.showBrandDropdown = false;
        this.showModelDropdown = false;
        this.showYearDropdown = false;
      }
    });
  }

ngOnInit(): void {
// this.adDetailsForm.get('allow_submission')?.valueChanges.subscribe(allowSubmission => {
//     if (allowSubmission === 'true') {
//       // When Soom is selected, clear the contact channel
//       this.adDetailsForm.get('contacting_channel')?.setValue('');
//     }
//   });
 this.adDetailsForm.get('allow_submission')?.valueChanges.subscribe(allowSubmission => {
    if (allowSubmission === 'true') {
      // When Soom is selected, clear the contact channel and remove validation
      this.adDetailsForm.get('contacting_channel')?.setValue('');
      this.adDetailsForm.get('contacting_channel')?.clearValidators();
      this.adDetailsForm.get('contacting_channel')?.updateValueAndValidity();
    } else {
      // When Direct is selected, add back the required validation
      this.adDetailsForm.get('contacting_channel')?.setValidators([Validators.required]);
      this.adDetailsForm.get('contacting_channel')?.updateValueAndValidity();
    }
  });
  this.userService.userProfile$.subscribe(profile => {
  if (profile) {
    this.user = profile.user; // ✅ profile.user has first_name, last_name, etc.
    console.log('this.user: ', this.user);
  }
});
  
 const draftId = this.route.snapshot.queryParamMap.get('draftId');
  
  if (draftId) {
    this.loadDraftData(+draftId); // convert to number
  }
  // this.onBrandChange();
  this.loadBrands();
  this.getPartCategoryList()
   this.getBrandPartList()
 this.initForm();
    this.loadCities();
    this.setupFormListeners();
  this.loadCitys();

  this.platesForm.get('country_id_lp')?.valueChanges.subscribe((countryId) => {
  if (this.isLoadingDraft) return;
  this.onCountryChange(countryId);
});

this.platesForm.get('city_id_lp')?.valueChanges.subscribe((cityId) => {
  if (this.isLoadingDraft) return;
  this.onCitySelected(cityId);
});

}

private validateContactChannelForDirect(): boolean {
  const allowSubmission = this.adDetailsForm.get('allow_submission')?.value;
  const contactingChannel = this.adDetailsForm.get('contacting_channel')?.value;
  
  // If Soom is selected, contact channel is not required
  if (allowSubmission === 'true') {
    return true;
  }
  
  // If Direct is selected, contact channel is required
  if (allowSubmission === 'false' && !contactingChannel) {
    this.adDetailsForm.get('contacting_channel')?.setErrors({ required: true });
    return false;
  }
  
  return true;
}


// private validateContactChannelForDirect(): boolean {
//   const allowSubmission = this.adDetailsForm.get('allow_submission')?.value;
//   const contactingChannel = this.adDetailsForm.get('contacting_channel')?.value;
  
//   if (allowSubmission === 'false' && !contactingChannel) {
//     // Direct contact method selected but no contact channel chosen
//     this.adDetailsForm.get('contacting_channel')?.setErrors({ required: true });
//     return false;
//   }
  
//   return true;
// }


private getDefaultBankCardId(): number | null {
  if (!this.user || !this.user.bank_cards || this.user.bank_cards.length === 0) {
    console.warn('No bank cards found for user');
    return null;
  }

  // Try to find the default card first
  const defaultCard = this.user.bank_cards.find((card: any) => card.is_default);
  if (defaultCard) {
    return defaultCard.id;
  }

  // If no default card, use the first one
  return this.user.bank_cards[0].id;
}


selectPaymentMethod(type: 'card' | 'tamara' | 'tabby', cardId?: number) {
  this.selectedPaymentMethod = { type, id: cardId };
  
  // Auto-select default card if choosing card payment without specific card
  if (type === 'card' && !cardId && this.user?.bank_cards?.length) {
    const defaultCard = this.user.bank_cards.find((card: any) => card.is_default);
    if (defaultCard) {
      this.selectedPaymentMethod.id = defaultCard.id;
    } else {
      this.selectedPaymentMethod.id = this.user.bank_cards[0].id;
    }
  }
}

addNewCard() {
  // Implement navigation to add card page or show form
  this.router.navigate(['/payment-methods/add']);
  // Or show an inline form:
  // this.showAddCardForm = true;
}


loadDraftData(draftId: number) {
  this.listingService.getSingleDraft(draftId).subscribe({
    next: (res: any) => {
      const draft = res?.data;
      if (!draft) return;

      // ✅ 1. Select vehicle type (1: Motorcycle, 2: Spare Part, 3: License Plate)
      this.selectVehicleType(draft.category_id);

      // ✅ 2. Handle LICENSE PLATE case
      if (draft.license_plate) {
        const licensePlate = draft.license_plate;

        // Patch basic fields
        // this.platesForm.patchValue({
        //   country_id_lp: licensePlate.country_id,
        //   city_id_lp: licensePlate.city_id,
        //   plate_format_id: licensePlate.plate_format_id,
        // });
        this.isLoadingDraft = true;

this.platesForm.patchValue({
  country_id_lp: draft.license_plate.country_id,
  city_id_lp: draft.license_plate.city_id,
  plate_format_id: draft.license_plate.plate_format_id,
});

// ⏳ Wait for dynamic fields to be added (after city selection triggers city change & format load)
setTimeout(() => {
  this.patchDynamicFieldValues(draft.license_plate.field_values.map((fv: any) => ({
    id: fv.id,
    controlName: fv.field_value
  })));
}, 300); // 300ms should be enough



this.dynamicFields = draft.license_plate.field_values.map((fv: FieldValue): DynamicField => {
  const f: FormatField = fv.format_field;
  return {
    ...f,
    controlName: `${f.field_name}_${f.id}`,
  };
});

this.addDynamicFieldsToForm(); // <-- ensures form controls exist

// Delay patching to ensure fields are registered
// setTimeout(() => {
//   this.patchDynamicFieldValues(draft.license_plate.field_values);
//   this.isLoadingDraft = false;
// }, 0);


        const fieldValues = licensePlate.field_values;

        if (fieldValues?.length) {
          // ✅ Build dynamicFields array from format_field inside each field_value
          interface FormatField {
            id: number;
            field_name: string;
            is_required: boolean;
            min_length?: number;
            max_length?: number;
            character_type?: string;
            writing_system?: string;
            validation_pattern?: string;
            // Add other properties as needed from API
          }

          interface FieldValue {
            plate_format_field_id: number;
            field_value: string;
            format_field: FormatField;
          }

          interface DynamicField extends FormatField {
            controlName: string;
          }
          this.addDynamicFieldsToForm();

      
          Promise.resolve().then(() => {
  this.patchDynamicFieldValues(fieldValues);
});
        }
      }
if (draft.motorcycle) {
  const { brand_id, model_id, year_id } = draft.motorcycle;

  this.vehicleForm.patchValue({
    brand_id,
    model_id,
    year_id,
    engine: parseInt(draft.motorcycle.engine),
    mileage: draft.motorcycle.mileage,
    body_condition: draft.motorcycle.body_condition,
    modified: draft.motorcycle.modified ? 'Yes' : 'No',
    insurance: draft.motorcycle.insurance ? 'Yes' : 'No',
    general_condition: draft.motorcycle.general_condition,
    vehicle_care: draft.motorcycle.vehicle_care,
    transmission: draft.motorcycle.transmission
  });

  this.uploadedImageUrls = draft.images.map((img: any) => img.image_url);

  // ✅ Step 1: Load models using brand_id
  this.listingService.getMotorcycleFilters({ brand_id }).subscribe((brandRes) => {
    this.models = brandRes.data.models || [];

    // ✅ Step 2: Load years using brand_id and model_id
    this.listingService.getMotorcycleFilters({ brand_id, model_id }).subscribe((modelRes) => {
      this.years = modelRes.data.years.map((y: any) => ({
        id: y.id,
        year: y.year,
      }));
    });
  });
}


if (draft.spare_part) {
  const moto = draft.spare_part.motorcycles?.[0]; // Get the first linked motorcycle

  // 1. Patch bikeForm
  this.bikeForm.patchValue({
    brand_id: moto?.brand_id || '',
    model_id: moto?.model_id || '',
    year_id: moto?.year_id || '',
    bike_part_brand_id: draft.spare_part.bike_part_brand_id,
    bike_part_category_id: draft.spare_part.bike_part_category_id,
    general_condition: draft.spare_part.condition,
    description: draft.description
  });
this.uploadedImageUrls = draft.images.map((img: any) => img.image_url);
  // 2. Load models if brand exists
  if (moto?.brand_id) {
    this.listingService.getMotorcycleFilters({ brand_id: moto.brand_id }).subscribe((res) => {
      this.models = res.data.models || [];

      // 3. Load years if model also exists
      if (moto?.model_id) {
        this.listingService.getMotorcycleFilters({
          brand_id: moto.brand_id,
          model_id: moto.model_id
        }).subscribe((res2) => {
          this.years = res2.data.years || [];
        });
      }
    });
  }
}

// if(draft.spare_part) {
//  const { brand_id, model_id, year_id } = draft.spare_part;
//   // ✅ Handle SPARE PART case
//   this.bikeForm.patchValue({
//      brand_id,
//     model_id,
//     year_id,
//     bike_part_brand_id: draft.spare_part.bike_part_brand_id,
//     bike_part_category_id: draft.spare_part.bike_part_category_id,
//     // brand_id: draft.motorcycles.brand_id,
//     // model_id: draft.motorcycles.model_id,
//     // year_id: draft.motorcycles.year_id,
//     general_condition: draft.spare_part.condition,
//     description: draft.description
//   });
// }


    // this.bikeForm = this.fb.group({
    //   category_id: [2, Validators.required],
    //   images: [[]],
    //   bike_part_brand_id: ['', Validators.required],
    //   bike_part_category_id: ['', Validators.required],
    //   brand_id: ['', Validators.required],
    //   model_id: ['', Validators.required],
    //   year_id: [''],
    //   condition: ['new', Validators.required],
    //   description: ['', [Validators.required, Validators.minLength(20)]],
    // });




      // ✅ 4. Handle Ad Details (Step 2)
      this.adDetailsForm.patchValue({
        title: draft.title,
        description: draft.description,
        price: draft.price,
        city: draft.city_id,
        country: draft.country_id,
        listing_type_id: draft.listing_type_id,
        contacting_channel: draft.contacting_channel,
        seller_type: draft.seller_type,
        allow_submission: draft.allow_submission ? 'true' : 'false',
        minimum_bid: draft.minimum_bid
      });

this.uploadedImages = (draft.images || []).map((img: any) => ({
  preview: img.image_url,
  serverUrl: img.image_url,
  file: undefined
}));
      // ✅ 5. Track the current draft step
      this.currentStep = draft.step || 1;
    },
    error: (err) => {
      console.error('❌ Failed to load draft:', err);
    }
  });
}


patchDynamicFieldValues(fieldValues: FieldValue[]) {
  fieldValues.forEach(fv => {
    const field = this.dynamicFields.find(f => f.id === fv.plate_format_field_id);
    if (field) {
      const controlName = field.controlName;
      this.platesForm.get(controlName)?.patchValue(fv.field_value);
    } else {
      console.warn(`⚠️ No dynamic field found for id ${fv.plate_format_field_id}`);
    }
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

  Object.keys(this.platesForm.controls).forEach(key => {
    const control = this.platesForm.get(key);

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


  if (field.character_type === 'letter') {
  if (field.writing_system === 'latin') {
    validators.push(Validators.pattern(/^[a-zA-Z]+$/)); // على الأقل حرف واحد
  } else if (field.writing_system === 'arabic') {
    validators.push(Validators.pattern(/^[\u0600-\u06FF\s]+$/)); // حروف عربية ومسافات
  }
} else if (field.character_type === 'digit') {
  if (field.writing_system === 'latin') {
    validators.push(Validators.pattern(/^[0-9]+$/)); // أرقام لاتينية
  } else if (field.writing_system === 'arabic') {
    validators.push(Validators.pattern(/^[\u0660-\u0669]+$/)); // أرقام عربية هندية (٠-٩)
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


addDynamicFieldsToForm(): void {
  this.dynamicFields.forEach(field => {
    // Create a unique control name using field ID
    const controlName = `field_${field.id}`;
    field.controlName = controlName; // Store it on the field object

    const validators = this.getValidatorsForField(field);

    if (!this.platesForm.contains(controlName)) {
      this.platesForm.addControl(controlName, new FormControl('', validators));
    }
  });
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

onCountryChangecities(event: any): void {
  const countryId = Number(event.target.value); // selected country_id
  this.filteredCities = this.allCities.filter(city => city.country_id === countryId);

  // reset selected city
  // this.form.get('city')?.reset();
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
  // this.dynamicFields = format.fields.map(field => {
  this.dynamicFields = fields.map((field: FormatField) => {
    const controlName = `${field.field_name}_${field.id}`;

    if (!this.platesForm.contains(controlName)) {
      this.platesForm.addControl(
        controlName,
        new FormControl('', this.getValidatorsForField(field))
      );
    }

    return {
      ...field,
      controlName,
    } as DynamicField;
  });

  if (this.draftLicensePlateFieldValues?.length) {
    this.patchDynamicFieldValues(this.draftLicensePlateFieldValues);
  }
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
    });
  }
  getPartCategoryList(){
    this.listingService.getPartCategoryList().subscribe((res) => {
      this.partCategory = res.bike_part_categories;
    });
  }
  // Add this method to check if Soom is selected
isSoomSelected(): boolean {
  return this.adDetailsForm.get('allow_submission')?.value === 'true';
}


  selectType(type: 'motorcycle' | 'bike-part' | 'license-plate') {
    this.selectedType = type;
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

  // Load brands on init
loadBrands() {
  this.listingService.getMotorcycleBrands().subscribe((res) => {
    this.brands = res.data;   // assuming backend returns { data: [...] }
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

   // Selection methods
  selectBrand(brand: any) {
    this.brandSearchTerm = brand.name;
    this.vehicleForm.patchValue({ brand_id: brand.id });
    this.bikeForm.patchValue({ brand_id: brand.id });
    this.showBrandDropdown = false;
    this.onBrandChange(brand.id);
  }

  selectModel(model: any) {
    this.modelSearchTerm = model.name;
    this.vehicleForm.patchValue({ model_id: model.id });
    this.bikeForm.patchValue({ model_id: model.id });
    this.showModelDropdown = false;
    this.onModelChange(model.id);
  }

  selectYear(year: any) {
    this.yearSearchTerm = year.year.toString();
    this.vehicleForm.patchValue({ year_id: year.id });
    this.bikeForm.patchValue({ year_id: year.id });
    this.showYearDropdown = false;
  }

  // Updated existing methods
  onBrandChange(brandId: number) {
    this.models = [];
    this.years = [];
    this.modelSearchTerm = '';
    this.yearSearchTerm = '';
    this.filteredModels = [];
    this.filteredYears = [];
    
    this.vehicleForm.patchValue({ model_id: '', year_id: '' });
    this.bikeForm.patchValue({ model_id: '', year_id: '' });

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
    this.bikeForm.patchValue({ year_id: '' });

    if (modelId) {
      this.listingService.getMotorcycleYears(modelId).subscribe((res) => {
        this.years = res.data;
        this.filteredYears = res.data;
      });
    }
  }

// onBrandChange(brandId: number) {
//   this.models = [];
//   this.years = [];
//   this.vehicleForm.patchValue({ model_id: '', year_id: '' });
//   this.bikeForm.patchValue({ model_id: '', year_id: '' });

//   if (brandId) {
//     this.listingService.getMotorcycleModels(brandId).subscribe((res) => {
//       this.models = res.data;   // assuming { data: [...] }
//     });
//   }
// }

// onModelChange(modelId: number) {
//   this.years = [];
//   this.vehicleForm.patchValue({ year_id: '' });
//   this.bikeForm.patchValue({ year_id: '' });

//   if (modelId) {
//     this.listingService.getMotorcycleYears(modelId).subscribe((res) => {
//       this.years = res.data;   // assuming { data: [...] }
//     });
//   }
// }


  get contactMethodsFormGroup(): FormGroup {
    return this.adDetailsForm.get('contactMethods') as FormGroup;
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
    this.selectedVehicleType = type;
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
    this.adDetailsForm.patchValue({ seller_type: type });
  }

  toggleContactMethod(method: string): void {
    const contactMethods = this.adDetailsForm.get('contactMethods');
    const currentValue = contactMethods?.get(method)?.value;
    contactMethods?.get(method)?.setValue(!currentValue);
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
    },
    error: (err) => {
      console.error('Error fetching pricing:', err);
    }
  });
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

logFormValues() {
  this.dynamicFields.forEach(field => {
    const value = this.platesForm.get(field.controlName)?.value;
  });
}

private async handleStep1() {
  if (!this.validateStep1()) return;

  const step1Data = this.prepareStep1Data();
  if (!step1Data) return;

  step1Data.step = 1;

  try {
    const response = await this.listingService.addPost(step1Data).toPromise();
    this.listingId = response?.listing_id;

    // Store it for later steps
    this.sharedFormDataService.setStep1Data({ ...step1Data, listing_id: this.listingId });
    this.currentStep++;
  } catch (error) {
    console.error('Error creating listing (step 1):', error);
    alert('Failed to create listing. Please try again.');
  }
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
        step: 1,
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
        step: 1,
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

      case 3: // License Plate
      const dynamicFieldValues = this.dynamicFields.map(field => {
        // Get the raw value from the form control
        const rawValue = this.platesForm.get(field.controlName)?.value;
        
        // Convert to string and handle null/undefined
        let fieldValue = rawValue !== null && rawValue !== undefined 
          ? String(rawValue) 
          : '';

        return {
          field_id: field.id,
          value: fieldValue
        };
      });

      return {
        category_id: 3,
        step: 1,
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
  if (!this.adDetailsForm.valid || !this.validateContactChannelForDirect()) {
    this.adDetailsForm.markAllAsTouched();
    return;
  }

  // Only include minimum_bid if Soom is selected
  const isSoomSelected = this.adDetailsForm.value.allow_submission === 'true';
  
  const step2Data: any = {
    step: 2,
    listing_id: this.listingId,
    title: this.adDetailsForm.value.title,
    description: this.adDetailsForm.value.description,
    price: parseFloat(this.adDetailsForm.value.price),
    allow_submission: isSoomSelected,
    contacting_channel: this.adDetailsForm.value.contacting_channel,
    country_id: Number(this.adDetailsForm.value.country),
    city_id: parseInt(this.adDetailsForm.value.city),
    seller_type: this.adDetailsForm.value.seller_type,
    listing_type_id: 1,
    auction_enabled: isSoomSelected,
  };

  // Only add minimum_bid if Soom is selected
  if (isSoomSelected) {
    step2Data.minimum_bid = this.adDetailsForm.value.minimum_bid || 0;
  }

  this.sharedFormDataService.setStep2Data(step2Data);

  try {
    await this.listingService.addPost(step2Data).toPromise();

    const step1Data = this.sharedFormDataService.getStep1Data();
    const priceData = await this.getPricingInfo(step1Data, step2Data);
    this.pricingInfo = priceData;

    this.currentStep++;
  } catch (error) {
    console.error('Error updating listing (step 2):', error);
    alert('Failed to save ad details. Please try again.');
  }
}
// private async handleStep2() {
//   // if (!this.adDetailsForm.valid) {
//    if (!this.adDetailsForm.valid || !this.validateContactChannelForDirect()) {
//     this.adDetailsForm.markAllAsTouched();
//     return;
//   }

//   const step2Data = {
//     step: 2,
//     listing_id: this.listingId,
//     title: this.adDetailsForm.value.title,
//     description: this.adDetailsForm.value.description,
//     price: parseFloat(this.adDetailsForm.value.price),
//     allow_submission: this.adDetailsForm.value.allow_submission === 'true',
//     contacting_channel: this.adDetailsForm.value.contacting_channel,
//     country_id: Number(this.adDetailsForm.value.country),
//     city_id: parseInt(this.adDetailsForm.value.city),
//     seller_type: this.adDetailsForm.value.seller_type,
//     listing_type_id: 1,
//     auction_enabled: this.adDetailsForm.value.allow_submission === 'true',
//     minimum_bid: this.adDetailsForm.value.minimum_bid,
//   };

//   this.sharedFormDataService.setStep2Data(step2Data);

//   try {
//     // Call API with step 2 data
//     await this.listingService.addPost(step2Data).toPromise(); // new API method

//     // Optional: get pricing after successful save
//     const step1Data = this.sharedFormDataService.getStep1Data();
//     const priceData = await this.getPricingInfo(step1Data, step2Data);
//     this.pricingInfo = priceData;

//     this.currentStep++;
//   } catch (error) {
//     console.error('Error updating listing (step 2):', error);
//     alert('Failed to save ad details. Please try again.');
//   }
// }

// private async handleStep3() {
//   const step1Data = this.sharedFormDataService.getStep1Data();
//   const step2Data = this.sharedFormDataService.getStep2Data();
//   const bankCardId = this.getDefaultBankCardId();
  
//   if (!bankCardId) {
//     alert('Please add a payment method before proceeding');
//     return;
//   }

//   const payload = {
//     step: 3,
//     listing_id: this.listingId,
//     title: step2Data.title,
//     description: step2Data.description,
//     price: step2Data.price,
//     listing_type_id: step2Data.listing_type_id,
//     city_id: step2Data.city_id,
//     auction_enabled: step2Data.auction_enabled,
//     minimum_bid: step2Data.minimum_bid,
//     allow_submission: step2Data.allow_submission,
//     contacting_channel: step2Data.contacting_channel,
//     seller_type: step2Data.seller_type,
//     ...this.getTypeSpecificPayload(step1Data),
//     amount: 19.6,
//     //  bank_card_id: bankCardId
//     // bank_card_id: 6
//   };

//   try {
//     const res = await this.listingService.addPost(payload).toPromise();
    
//     // Check if we have a redirect URL for payment
//     if (res && res.redirect_url) {
//       // Store payment information for later verification
//       localStorage.setItem('pendingPayment', JSON.stringify({
//         payment_id: res.payment_id,
//         listing_id: res.listing_id,
//         timestamp: new Date().getTime()
//       }));
      
//       // Open payment in a new window
//       const paymentWindow = window.open(res.redirect_url, '_blank', 'width=800,height=600');
      
//       if (!paymentWindow) {
//         // If popup was blocked, fall back to redirecting current tab
//         alert('Popup blocked. Please allow popups for this site to complete payment.');
//         window.location.href = res.redirect_url;
//       } else {
//         // Navigate to payment processing page
//         this.router.navigate(['/payment-processing'], { 
//           queryParams: { 
//             listingId: res.listing_id,
//             paymentId: res.payment_id 
//           } 
//         });
        
//         // Start polling for payment status
//         // this.startPaymentStatusPolling(res.payment_id);
//       }
//     } else {
//       // Fallback: navigate to home if no redirect URL
//       console.warn('No redirect URL provided, navigating to home');
//       this.router.navigate(['/home']);
//     }
//   } catch (err) {
//     console.error('Error creating ad:', err);
//     alert('Failed to create ad. Please try again.');
//   }
// }

private async handleStep3() {
  const step1Data = this.sharedFormDataService.getStep1Data();
  const step2Data = this.sharedFormDataService.getStep2Data();
  const bankCardId = this.getDefaultBankCardId();
  
  if (!bankCardId) {
    alert('Please add a payment method before proceeding');
    return;
  }

  const payload = {
    step: 3,
    listing_id: this.listingId,
    title: step2Data.title,
    description: step2Data.description,
    price: step2Data.price,
    listing_type_id: step2Data.listing_type_id,
    city_id: step2Data.city_id,
    auction_enabled: step2Data.auction_enabled,
    minimum_bid: step2Data.minimum_bid,
    allow_submission: step2Data.allow_submission,
    contacting_channel: step2Data.contacting_channel,
    seller_type: step2Data.seller_type,
    ...this.getTypeSpecificPayload(step1Data),
    amount: 19.6,
    // bank_card_id: bankCardId
    // bank_card_id: 6
  };

  try {
    const res = await this.listingService.addPost(payload).toPromise();
    
    // Check if we have a redirect URL for payment
    if (res && res.redirect_url) {
      // Store payment information for later verification
      localStorage.setItem('pendingPayment', JSON.stringify({
        payment_id: res.payment_id,
        listing_id: res.listing_id,
        timestamp: new Date().getTime(),
        redirect_url: res.redirect_url
      }));
      
      // Redirect the current window to the payment URL
      window.location.href = res.redirect_url;
    } else {
      // Fallback: navigate to home if no redirect URL
      console.warn('No redirect URL provided, navigating to home');
      this.router.navigate(['/home']);
    }
  } catch (err) {
    console.error('Error creating ad:', err);
    alert('Failed to create ad. Please try again.');
  }
}
// In your ProductFormComponent
startPaymentStatusPolling(paymentId: number) {
  const pollingInterval = setInterval(() => {
    this.listingService.checkPaymentStatus(paymentId).subscribe({
      next: (response: any) => {
        if (response.status === 'completed') {
          clearInterval(pollingInterval);
          this.router.navigate(['/home']);
        } else if (response.status === 'failed') {
          clearInterval(pollingInterval);
          this.router.navigate(['/payment-failed']);
        }
        // Continue polling if status is still pending
      },
      error: (err) => {
        console.error('Error checking payment status:', err);
        clearInterval(pollingInterval);
      }
    });
  }, 3000); // Check every 3 seconds

  // Timeout after 5 minutes
  setTimeout(() => {
    clearInterval(pollingInterval);
    this.router.navigate(['/payment-unknown']);
  }, 300000);
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
      seller_type: step2Data.seller_type,
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



  removePromocode() {
    this.promocode = '';
    this.promocodeApplied = false;
    this.adFees.discounted = this.adFees.original;
  }

  // selectPaymentMethod(id: string) {
  //   this.paymentMethods.forEach((method) => {
  //     method.selected = method.id === id;
  //   });
  // }
selectContactMethod(method: string): void {
  if (this.isSoomSelected() && (method === 'phone' || method === 'whatsapp')) {
    // Don't allow phone/whatsapp selection when Soom is enabled
    return;
  }
  
  this.adDetailsForm.get('contacting_channel')?.setValue(method);
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

