import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ListingService } from './listingService/listing-service.service';
import { title } from 'process';
import { SharedFormDataService } from '../../../services/shared-form-data.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule,TranslateModule],
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
  platesForm!: FormGroup;
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
  // uploadedImages: string[] = []; // Base64 previews
  // uploadedImageUrls: string[] = []; // Actual URLs from server
  // maxImages = 10;

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

  allCities: Array<{ id: number; name: string; country_id: number }> = [];
  cities: Array<{ id: number; name: string; country_id: number }> = [];
  countries: Array<{ id: number; name: string; code: string }> = [];

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
  constructor(
    private fb: FormBuilder,
    private listingService: ListingService,
    private sharedFormDataService: SharedFormDataService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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
      digits_count: ['', Validators.required],
    });

    // this.adDetailsForm = this.fb.group({
    //   title: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.minLength(5),
    //       Validators.maxLength(100),
    //     ],
    //   ],
    //   description: ['', [Validators.required, Validators.minLength(20)]],
    //   allow_submission: ['', Validators.required],
    //   contacting_channel: ['', Validators.required],
    //   price: ['', [Validators.required, Validators.min(1)]],
    //   city: ['', Validators.required],
    //   sellerType: ['', Validators.required], // ✅ use a single control here
    // });
    this.adDetailsForm = this.fb.group({
      title: ['',[ Validators.required, Validators.minLength(5),Validators.maxLength(100),],],
      description: ['', [Validators.required, Validators.minLength(20)]],
      allow_submission: ['', Validators.required],
      contacting_channel: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      country: ['',Validators.required],
      city: ['', Validators.required],
      sellerType: ['', Validators.required],
      auto_decline_threshold: [0] // Add this new field for Soom settings
    });


    // 'category_id' => $request->category_id,
    // 'country_id' => $request->country_id,
    // 'city_id' => $request->city_id,
    // 'auction_enabled' => $request->auction_enabled ?? false,
    // 'minimum_bid' => $request->minimum_bid,
    // 'allow_submission' => $request->allow_submission ?? false,
    // 'listing_type_id' => $request->listing_type_id,
    // 'contacting_channel' => $request->contacting_channel,
    // 'seller_type' => $request->seller_type,
    this.checkoutForm = this.fb.group({
      agreeToTerms: [false, Validators.requiredTrue],
    });
  }
  ngOnInit(): void {
    this.selectedVehicleType = this.vehicleOptions[0].category_id;
    this.loadCitys();
    this.loadBrands();
    this.getBrandPartList()
    this.getPartCategoryList();


    this.adDetailsForm.get('allow_submission')?.valueChanges.subscribe(value => {
      if (value === 'true') { // Soom selected
        this.adDetailsForm.get('contacting_channel')?.setValue('');
        this.adDetailsForm.get('contacting_channel')?.disable();
      } else { // Direct selected
        this.adDetailsForm.get('contacting_channel')?.enable();
      }
    });
  }

  getBrandPartList(){
    this.listingService.getBrandPartList().subscribe((res) => {
      this.brandsPart = res.data;
      console.log('brandsPart:', this.brandsPart);
    });
  }
  getPartCategoryList(){
    this.listingService.getPartCategoryList().subscribe((res) => {
      this.partCategory = res.data;
      console.log('partCategory:', this.partCategory);
    });
  }
  // Add this method to check if Soom is selected
isSoomSelected(): boolean {
  return this.adDetailsForm.get('allow_submission')?.value === 'true';
}
  loadCitys() {
    this.listingService.getCityList().subscribe((res) => {
      this.countries = res.countries;
      this.allCities = res.cities; // store all cities
      console.log('All cities:', this.allCities);
    });
  }
  onCountryChange(countryId: string) {
    this.platesForm.patchValue({ country_id_lp: countryId });
    this.platesForm.patchValue({ city_id_lp: countryId });

    const id = parseInt(countryId, 10);
    this.cities = this.allCities.filter((city) => city.country_id === id);
    console.log('Filtered cities:', this.cities);
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

  // handleFileInput(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (!input.files) return;

  //   const files = Array.from(input.files).slice(
  //     0,
  //     this.maxImages - this.uploadedImages.length
  //   );

  //   files.forEach((file) => {
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert(`File ${file.name} is too large. Maximum size is 5MB.`);
  //       return;
  //     }

  //     // Upload image immediately and get URL
  //     this.uploadImage(file);

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64 = reader.result as string;
  //       this.uploadedImages.push(base64); // for preview only
  //     };
  //     reader.readAsDataURL(file);
  //   });

  //   input.value = '';
  // }

  // uploadImage(file: File): void {
  //   const formData = new FormData();
  //   formData.append('image', file);

  //   this.listingService.uploadImage(formData).subscribe({
  //     next: (response) => {
  //       // Assuming the API returns { url: 'https://example.com/image.jpg' }
  //       this.uploadedImageUrls.push(response.url);
  //       this.uploadedFiles.push(file);

  //       // Update form control with URLs
  //       this.vehicleForm.patchValue({ images: this.uploadedImageUrls });
  //     },
  //     error: (err) => {
  //       console.error('Error uploading image:', err);
  //       alert('Failed to upload image. Please try again.');
  //     },
  //   });
  // }

  // removeImage(index: number): void {
  //   this.uploadedImages.splice(index, 1);
  //   this.uploadedFiles.splice(index, 1);
  //   this.uploadedImageUrls.splice(index, 1);

  //   this.vehicleForm.patchValue({ images: this.uploadedImageUrls });
  // }
  // In your component


// handleFileInput(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (!input.files) return;

//   const files = Array.from(input.files).slice(
//     0,
//     this.maxImages - this.uploadedImages.length
//   );

//   files.forEach((file) => {
//     if (file.size > 5 * 1024 * 1024) {
//       alert(`File ${file.name} is too large. Maximum size is 5MB.`);
//       return;
//     }

//     // Upload image immediately
//     this.uploadImage(file);

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64 = reader.result as string;
//       this.uploadedImages.push(base64);
//     };
//     reader.readAsDataURL(file);
//   });

//   input.value = '';
// }

// // uploadImage(file: File): void {
// //   const formData = new FormData();
// //   formData.append('images[]', file);

// //   this.listingService.uploadImage(formData).subscribe({
// //     next: (response) => {
// //       // Assuming API returns { url: 'https://example.com/image.jpg' }
// //       this.uploadedImageUrls.push(response.url);

// //       // Update form control if needed
// //       this.vehicleForm.patchValue({ images: this.uploadedImageUrls });
// //     },
// //     error: (err) => {
// //       console.error('Error uploading image:', err);
// //       alert('Failed to upload image. Please try again.');
// //     },
// //   });
// // }

// // In your component
// uploadImage(file: File): void {
//   const formData = new FormData();
//   formData.append('image', file); // Make sure this matches your API expected field name

//   this.listingService.uploadImage(formData).subscribe({
//     next: (response) => {
//       // Assuming response looks like:
//       // { message: "...", paths: ["url1", "url2"] }

//       // Add ALL returned paths to uploadedImageUrls
//       response.paths.forEach(url => {
//         if (!this.uploadedImageUrls.includes(url)) {
//           this.uploadedImageUrls.push(url);
//         }
//       });

//       // Update form control
//       this.vehicleForm.patchValue({
//         images: this.uploadedImageUrls
//       });
//     },
//     error: (err) => {
//       console.error('Upload error:', err);
//       // Remove the failed image preview
//       this.uploadedImages = this.uploadedImages.filter(img => img !== file);
//     }
//   });
// }
// removeImage(index: number): void {
//   this.uploadedImages.splice(index, 1);
//   this.uploadedImageUrls.splice(index, 1);
//   // Update form control
//   this.vehicleForm.patchValue({ images: this.uploadedImageUrls });
// }

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

  // private handleStep1Form(form: FormGroup, listingTypeId: number): void {
  //   if (form.valid && this.uploadedImages.length >= 4) {
  //     const step1Data = {
  //       listingTypeId,
  //       images: this.uploadedImages,
  //       ...form.value
  //     };
  //     this.sharedFormDataService.setStep1Data(step1Data);
  //     console.log('step1Data', step1Data);
  //     this.currentStep++;
  //   } else {
  //     form.markAllAsTouched();
  //   }
  // }
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
  // prepareFormData(): any {
  //   const vehicleData = this.vehicleForm.value;
  //   const adData = this.adDetailsForm.value;
  //   const contactMethods = adData.contactMethods || {};

  //   // Process images
  //   const processedImages = vehicleData.images
  //     ? vehicleData.images.map((img: string) => {
  //         if (img && img.startsWith('data:image')) {
  //           return img.split(',')[1];
  //         }
  //         return img;
  //       })
  //     : [];

  //   // Handle contacting channels
  //   const contactingChannels = [];
  //   if (contactMethods.phone) contactingChannels.push('phone');
  //   if (contactMethods.whatsapp) contactingChannels.push('whatsapp');

  //   return {
  //     listing_type_id: this.vehicleOptions.find(
  //       (option) => option.listing_type_id === this.selectedVehicleType
  //     )?.listing_type_id,
  //     title: adData.adName,
  //     description: adData.description,
  //     price: parseFloat(adData.price) || 0,
  //     contacting_channel: contactingChannels.join(',') || 'none',
  //     allow_submission: contactMethods.soom,
  //     seller_type: adData.sellerType === 'middleman' ? 'middleman' : 'owner',
  //     category_id: 1,
  //     brand_id: parseInt(vehicleData.brand, 10),
  //     model_id: parseInt(vehicleData.model, 10),
  //     year_id: parseInt(vehicleData.modelYear, 10), // This will now be the year ID
  //     type_id: 7,
  //     engine: vehicleData.engineCapacity.toString(),
  //     mileage: parseInt(vehicleData.kilometer, 10),
  //     body_condition: vehicleData.bodyCondition,
  //     modified:
  //       vehicleData.isModified === 'Yes' || vehicleData.isModified === true,
  //     insurance:
  //       vehicleData.hasInsurance === 'Yes' || vehicleData.hasInsurance === true,
  //     general_condition: vehicleData.condition,
  //     vehicle_care: vehicleData.vehicleCare,
  //     transmission: vehicleData.transmission,
  //     // images: processedImages
  //     images: [],
  //   };
  // }

  // submitForm(): void {
  //   if (this.vehicleForm.valid && this.adDetailsForm.valid) {
  //     this.isSubmitting = true;
  //     this.submissionError = false;

  //     const formData = this.prepareFormData();

  //     console.log('Prepared form data:', formData);

  //     let apiCall;
  //     switch (this.selectedVehicleType) {
  //       case 1:
  //         apiCall = this.listingService.createMotorcycleListing(formData);
  //         break;
  //       case 2:
  //         apiCall = this.listingService.createBikePartListing(formData);
  //         break;
  //       case 3:
  //         apiCall = this.listingService.createLicensePlateListing(formData);
  //         break;
  //       default:
  //         this.isSubmitting = false;
  //         this.submissionError = true;
  //         this.errorMessage = 'Invalid vehicle type selected';
  //         return;
  //     }

  //     apiCall.subscribe({
  //       next: (response) => {
  //         console.log('Form submitted successfully:', response);
  //         this.isSubmitting = false;
  //         this.submissionSuccess = true;
  //         this.currentStep = 3;
  //       },
  //       error: (error) => {
  //         console.error('Error submitting form:', error);
  //         this.isSubmitting = false;
  //         this.submissionError = true;
  //         this.errorMessage = error.message || 'Failed to submit listing. Please try again.';
  //       }
  //     });
  //   } else {
  //     console.log('Form is invalid');
  //     this.vehicleForm.markAllAsTouched();
  //     this.adDetailsForm.markAllAsTouched();
  //     this.highlightInvalidControls(this.vehicleForm);
  //     this.highlightInvalidControls(this.adDetailsForm);
  //   }
  // }
  // selectPlateFormat(formatId: string): void {
  //   this.platesForm.get('plateFormat')?.setValue(formatId);

  //   // Your existing logic for handling format changes
  //   const alphaControls = ['firstAlphabet', 'secondAlphabet', 'thirdAlphabet'];
  //   if (formatId === 'numbers-only') {
  //     alphaControls.forEach((control) => {
  //       this.platesForm.get(control)?.reset();
  //       this.platesForm.get(control)?.clearValidators();
  //       this.platesForm.get(control)?.updateValueAndValidity();
  //     });
  //   } else {
  //     alphaControls.forEach((control) => {
  //       this.platesForm.get(control)?.setValidators(Validators.required);
  //       this.platesForm.get(control)?.updateValueAndValidity();
  //     });
  //   }
  // }
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
    // Step 1: Vehicle-specific form
    if (this.currentStep === 1) {
      let isValid = false;
      let step1Data: any;

      switch (this.selectedVehicleType) {
        case 1: // Motorcycle
          isValid = this.vehicleForm.valid;
          step1Data = {
            category_id: 1,
            // type_id: 1,
            vehicleType: 'motorcycle',
            brand_id: parseInt(this.vehicleForm.value.brand_id),
            model_id: parseInt(this.vehicleForm.value.model_id),
            year_id: parseInt(this.vehicleForm.value.year_id),
            engine: this.vehicleForm.value.engine + 'cc', // Add "cc" suffix
            mileage: parseInt(this.vehicleForm.value.mileage),
            body_condition: this.vehicleForm.value.body_condition,
            modified: this.vehicleForm.value.modified === 'Yes',
            insurance: this.vehicleForm.value.insurance === 'Yes',
            general_condition: this.vehicleForm.value.general_condition,
            vehicle_care: this.vehicleForm.value.vehicle_care,
            transmission: this.vehicleForm.value.transmission,
            // images: this.uploadedImageUrls, // Use actual URLs
            images: this.uploadedImageUrls.filter(url => url !== null)
          };
          if (!isValid) {
            this.vehicleForm.markAllAsTouched();
            if (this.uploadedImageUrls.length < 4) {
              alert('Please upload at least 4 images');
            }
          }
          break;
        case 2: // Bike Part
          isValid = this.bikeForm.valid;
          step1Data = {
            category_id: 2,
            bike_part_brand_id: Number(this.bikeForm.value.bike_part_brand_id),
            bike_part_category_id: Number(this.bikeForm.value.bike_part_category_id),
            // brand_id: parseInt(this.bikeForm.value.brand_id),
            // model_id: parseInt(this.bikeForm.value.model_id),
            // year_id: parseInt(this.bikeForm.value.year_id),
            motorcycles: [{
              brand_id: parseInt(this.bikeForm.value.brand_id),
              model_id: parseInt(this.bikeForm.value.model_id),
              year_id: parseInt(this.bikeForm.value.year_id)
            }],
            condition: this.bikeForm.value.condition,
            description: this.bikeForm.value.description,
            // ...this.bikeForm.value,
            images: this.uploadedImageUrls.filter(url => url !== null)
          };
          // if (!this.bikeForm.valid) this.bikeForm.markAllAsTouched();
          if (!isValid) {
            this.bikeForm.markAllAsTouched();
            if (this.uploadedImageUrls.length < 4) {
              alert('Please upload at least 4 images');
            }
          }
          break;
        case 3: // License Plate
          isValid = this.platesForm.valid;
          // const combinedChars = [
          //   this.platesForm.value.firstAlphabet,
          //   this.platesForm.value.secondAlphabet,
          //   this.platesForm.value.thirdAlphabet
          // ]
          //   .filter(val => val !== null && val !== undefined && val !== '')
          //   .join('');
          step1Data = {
            category_id: 3,
            type_id: this.platesForm.value.type_id,
            plateFormatOptions: this.platesForm.value.plateFormat,
            country_id_lp:Number(this.platesForm.value.country_id_lp),
            city_id_lp: Number(this.platesForm.value.city_id_lp),
            // characters : combinedChars,
            firstAlphabet: this.platesForm.value.firstAlphabet,
            secondAlphabet: this.platesForm.value.secondAlphabet,
            thirdAlphabet: this.platesForm.value.thirdAlphabet,
            digits_count: this.platesForm.value.digits_count,

          };
          if (!isValid) {
            this.platesForm.markAllAsTouched();
          }
          break;
      }

      if (isValid) {
        this.sharedFormDataService.setStep1Data(step1Data);
        console.log('step1Data: ', step1Data);
        this.currentStep++;
      }
    } else if (this.currentStep === 2) {
      if (this.adDetailsForm.valid) {
        const step2Data = {
          title: this.adDetailsForm.value.title,
          description: this.adDetailsForm.value.description,
          price: parseFloat(this.adDetailsForm.value.price),
          allow_submission:this.adDetailsForm.value.allow_submission === 'true',
          contacting_channel: this.adDetailsForm.value.contacting_channel,
          country_id:Number(this.platesForm.value.country),
          city_id: parseInt(this.adDetailsForm.value.city),
          sellerType: this.adDetailsForm.value.sellerType,
          listing_type_id: 1,
          // country_id: 1,
          auction_enabled: false,
          minimum_bid: 0,
        };

        this.sharedFormDataService.setStep2Data(step2Data); // Save for step 3
        const step1Data = this.sharedFormDataService.getStep1Data();
        console.log('Step Data 2',step2Data);
        this.currentStep++;

        this.getPricingInfo(step1Data, step2Data).then(priceData => {
          // Then build and submit the final payload
          this.pricingInfo = priceData;
          console.log(' this.pricingInfo: ',  this.pricingInfo);
          console.log('priceData ',priceData);
          this.buildAndSubmitPayload(step1Data, step2Data, priceData);
        }).catch(error => {
          console.error('Error getting pricing:', error);
          alert('Failed to get pricing information. Please try again.');
        });

      } else {
        this.adDetailsForm.markAllAsTouched();
      }
    // } else if (this.currentStep === 3) {
    //   // if (this.checkoutForm.valid) {
    //     const step1Data = this.sharedFormDataService.getStep1Data();
    //     const step2Data = this.sharedFormDataService.getStep2Data();
    //     console.log('Step Data 11',step1Data);
    //     console.log('Step Data 22',step2Data);

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

    //       // Vehicle or item details
    //       listing_type_id: step1Data.listing_type_id,
    //       type_id: step1Data.type_id,
    //       brand_id: step1Data.brand_id,
    //       model_id: step1Data.model_id,
    //       year_id: step1Data.year_id,
    //       engine: step1Data.engine,
    //       mileage: step1Data.mileage,
    //       body_condition: step1Data.body_condition,
    //       modified: step1Data.modified,
    //       insurance: step1Data.insurance,
    //       general_condition: step1Data.general_condition,
    //       vehicle_care: step1Data.vehicle_care,
    //       transmission: step1Data.transmission,
    //       images: step1Data.images,
    //     };

    //     this.listingService.addPost(payload).subscribe({
    //       next: (res) => {
    //         console.log('Ad created successfully:', res);
    //         this.currentStep++; // maybe step 4 is "Thank you"
    //       },
    //       error: (err) => {
    //         console.error('Error creating ad:', err);
    //         alert('Failed to create ad. Please try again.');
    //       },
    //     });
    //   // } else {
    //   //   this.checkoutForm.markAllAsTouched();
    //   // }
    // }
  } else if (this.currentStep === 3) {
    const step1Data = this.sharedFormDataService.getStep1Data();
    const step2Data = this.sharedFormDataService.getStep2Data();
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
    this.listingService.addPost(payload).subscribe({
      next: (res) => {
        console.log('Ad created successfully:', res);
        this.currentStep++;
      },
      error: (err) => {
        console.error('Error creating ad:', err);
        alert('Failed to create ad. Please try again.');
      },
    });
  //   let payload: any = {
  //     // Common ad details
  //     title: step2Data.title,
  //     description: step2Data.description,
  //     price: step2Data.price,
  //     listing_type_id: step2Data.listing_type_id,
  //     // country_id: step2Data.country_id,
  //     city_id: step2Data.city_id,
  //     auction_enabled: step2Data.auction_enabled,
  //     minimum_bid: step2Data.minimum_bid,
  //     allow_submission: step2Data.allow_submission,
  //     contacting_channel: step2Data.contacting_channel,
  //     seller_type: step2Data.sellerType,
  //   };

  //   // Add vehicle/item-specific fields
  //   switch (this.selectedVehicleType) {
  //     case 1: // Motorcycle
  //       payload = {
  //         ...payload,
  //         category_id: step1Data.category_id,
  //         type_id: step1Data.type_id,
  //         brand_id: step1Data.brand_id,
  //         model_id: step1Data.model_id,
  //         year_id: step1Data.year_id,
  //         engine: step1Data.engine,
  //         mileage: step1Data.mileage,
  //         body_condition: step1Data.body_condition,
  //         modified: step1Data.modified,
  //         insurance: step1Data.insurance,
  //         general_condition: step1Data.general_condition,
  //         vehicle_care: step1Data.vehicle_care,
  //         transmission: step1Data.transmission,
  //         // images: step1Data.uploadedImageUrls,
  //         images: this.uploadedImageUrls.filter(url => url !== null)

  //       };
  //       break;

  //     case 2: // Bike Part
  //       payload = {
  //         ...payload,
  //         category_id: step1Data.category_id,
  //         bike_part_brand_id: step1Data.bike_part_brand_id,
  //         bike_part_category_id: step1Data.bike_part_category_id,
  //         // brand_id: step1Data.brand_id,
  //         // model_id: step1Data.model_id,
  //         // year_id: step1Data.year_id,
  //         motorcycles: step1Data.motorcycles,
  //         condition: step1Data.condition,
  //         description: step1Data.description,
  //         images: this.uploadedImageUrls.filter(url => url !== null)
  //       };
  //       break;

  //     case 3: // License Plate
  //       payload = {
  //         ...payload,
  //         type_id: step1Data.type_id,
  //         category_id: step1Data.category_id,
  //         plateFormatOptions: step1Data.plateFormatOptions,
  //         country_id_lp: Number(step1Data.country_id_lp),
  //         city_id_lp: Number(step1Data.city_id_lp),
  //         // characters: step1Data.characters,
  //         first_letter: step1Data.firstAlphabet,
  //         second_letter: step1Data.secondAlphabet,
  //         third_letter: step1Data.thirdAlphabet,
  //         digits_count: step1Data.digits_count,
  //         // images: step1Data.images, // Uncomment if images included
  //       };
  //       delete payload.brand_id;
  //       delete payload.model_id;
  //       delete payload.year_id;
  //       break;
  //       break;

  //   }

  //   // Submit to API
  //   this.listingService.addPost(payload).subscribe({
  //     next: (res) => {
  //       console.log('Ad created successfully:', res);
  //       this.currentStep++; // Move to thank-you or final step
  //     },
  //     error: (err) => {
  //       console.error('Error creating ad:', err);
  //       alert('Failed to create ad. Please try again.');
  //     },
  //   });
  }
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
