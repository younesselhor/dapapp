// import { Component, Input, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// interface Step {
//   number: number;
//   title: string;
//   description: string;
// }

// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './product-form.component.html',
//   styleUrls: ['./product-form.component.css']
// })
// export class ProductFormComponent implements OnInit {
//   @Input() currentStep = 1;

//   steps: Step[] = [
//     {
//       number: 1,
//       title: 'Filling Product Details',
//       description: 'Please provide your name and email'
//     },
//     {
//       number: 2,
//       title: 'Ad & Contact Details',
//       description: 'Details needed for customers to contact you'
//     },
//     {
//       number: 3,
//       title: 'Checkout',
//       description: 'Start collaborating with your team'
//     }
//   ];

//   vehicleForm!: FormGroup;
//   maxSteps = 3;

//   vehicleOptions = [
//     { id: 'motorcycle', name: 'Motorcycle', icon: 'motorcycle-icon', note: 'Fees depend on the type', imageUrl: '/pictures/motoIconPostingAdd.svg' },
//     { id: 'bike-part', name: 'Bike Part', icon: 'bike-part-icon', note: 'Fees depend on the type',imageUrl: '/pictures/usedpart.svg' },
//     { id: 'license-plate', name: 'License Plate', icon: 'license-plate-icon', note: 'SAR 300',imageUrl: '/pictures/licensePlate.svg' }
//   ];
// iconPath = [
//     { id: 'motorcycle', path: 'assets/icons/motorcycle.svg' },
//     { id: 'bike-part', path: 'assets/icons/usedpart.svg' },
//     { id: 'license-plate', path: 'assets/licensePlate.svg' }

// ];
//   selectedVehicleType = 'motorcycle';
//   brands = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Ducati', 'BMW', 'Harley-Davidson'];
//   years = Array.from({length: 30}, (_, i) => (new Date().getFullYear() - i).toString());
//   bodyConditions = ['As New', 'Used', 'Needs some fixes'];
//   vehicleCareOptions = ['Wakeel', 'USA', 'Europe', 'GCC', 'Customs License'];
//   transmissionTypes = ['Automatic', 'Manual', 'Semi-Automatic'];

//   constructor(private fb: FormBuilder) {
//     this.createForm();
//   }

//   ngOnInit(): void {
//   }

//   uploadedImages: string[] = [];
// maxImages = 10;

// // handleFileInput(event: Event): void {
// //   const input = event.target as HTMLInputElement;
// //   if (!input.files) return;

// //   const files = Array.from(input.files).slice(0, this.maxImages - this.uploadedImages.length);

// //   files.forEach(file => {
// //     const reader = new FileReader();
// //     reader.onload = () => {
// //       this.uploadedImages.push(reader.result as string);
// //     };
// //     reader.readAsDataURL(file);
// //   });

// //   // Reset input value so selecting same file twice still triggers change event
// //   input.value = '';
// // }

// handleFileInput(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (!input.files) return;

//   const files = Array.from(input.files).slice(0, this.maxImages - this.uploadedImages.length);
//   const currentImages = this.vehicleForm.get('images')?.value || [];

//   files.forEach(file => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64 = reader.result as string;
//       this.uploadedImages.push(base64);
//       currentImages.push(base64);

//       // Update the form control
//       this.vehicleForm.get('images')?.setValue(currentImages);
//     };
//     reader.readAsDataURL(file);
//   });

//   input.value = '';
// }

// removeImage(index: number): void {
//   this.uploadedImages.splice(index, 1);
// }

//   createForm(): void {
//     this.vehicleForm = this.fb.group({
//       vehicleType: ['motorcycle', Validators.required],
//       images: [[]],
//       brand: ['', Validators.required],
//       modelYear: ['', Validators.required],
//       bodyCondition: ['As New', Validators.required],
//       isModified: ['No', Validators.required],
//       hasInsurance: ['Yes', Validators.required],
//       condition: ['Used', Validators.required],
//       vehicleCare: ['Wakeel', Validators.required],
//       engineCapacity: ['', Validators.required],
//       kilometer: ['', Validators.required],
//       transmission: ['Automatic', Validators.required]
//     });
//   }

//   selectVehicleType(type: string): void {
//     this.selectedVehicleType = type;
//     this.vehicleForm.patchValue({ vehicleType: type });
//   }

//   selectBodyCondition(condition: string): void {
//     this.vehicleForm.patchValue({ bodyCondition: condition });
//   }

//   selectModified(value: string): void {
//     this.vehicleForm.patchValue({ isModified: value });
//   }

//   selectInsurance(value: string): void {
//     this.vehicleForm.patchValue({ hasInsurance: value });
//   }

//   selectCondition(condition: string): void {
//     this.vehicleForm.patchValue({ condition: condition });
//   }

//   selectVehicleCare(care: string): void {
//     this.vehicleForm.patchValue({ vehicleCare: care });
//   }

//   selectTransmission(type: string): void {
//     this.vehicleForm.patchValue({ transmission: type });
//   }

//   nextStep(): void {
//     if (this.currentStep < this.maxSteps) {
//       this.currentStep++;
//     } else {
//       this.submitForm();
//     }
//   console.log('form', this.vehicleForm.value);
//   }

//   previousStep(): void {
//     if (this.currentStep > 1) {
//       this.currentStep--;
//     }
//   }

//   submitForm(): void {
//     if (this.vehicleForm.valid) {
//       console.log('Form submitted:', this.vehicleForm.value);
//       // Handle form submission here
//     } else {
//       console.log('Form is invalid');
//       this.vehicleForm.markAllAsTouched();
//     }
//   }
// }
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ListingService } from './listingService/listing-service.service';
import { title } from 'process';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
// import { ListingService } from '../services/listing.service';

interface Step {
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() currentStep = 1;
  @ViewChild('vehicleFormRef') vehicleFormComponent!: ProductDetailsComponent;
@ViewChild('adDetailsFormRef') adDetailsFormComponent!: ContactDetailsComponent;

vehicleFormData: any | null = null;
  vehicleForm!: FormGroup;
  adDetailsForm!: FormGroup;
  checkoutForm!: FormGroup;
  bikeForm!: FormGroup;
  platesForm!: FormGroup;
  postingAnAd!:FormGroup
  maxSteps = 3;
  isSubmitting = false;
  submissionSuccess = false;
  submissionError = false;
  errorMessage = '';

  vehicleOptions = [
    { listing_type_id:1,id: 'motorcycle', name: 'Motorcycle', icon: 'motorcycle-icon', note: 'Fees depend on the type', imageUrl: '/pictures/motoIconPostingAdd.svg' },
    { listing_type_id:2 ,id: 'bike-part', name: 'Bike Part', icon: 'bike-part-icon', note: 'Fees depend on the type', imageUrl: '/pictures/usedpart.svg' },
    { listing_type_id:3,id: 'license-plate', name: 'License Plate', icon: 'license-plate-icon', note: 'SAR 300', imageUrl: '/pictures/licensePlate.svg' }
  ];


  iconPath = [
    { id: 'motorcycle', path: 'assets/icons/motorcycle.svg' },
    { id: 'bike-part', path: 'assets/icons/usedpart.svg' },
    { id: 'license-plate', path: 'assets/licensePlate.svg' }
  ];
  plateFormatOptions = [
    { id: 'numbers-alphabets', label: 'Numbers & Alphabets', selected: true },
    { id: 'numbers-only', label: 'Numbers Only', selected: false }
  ];

  selectedVehicleType = 1;

  brands: Array<{ id: number; name: string }> = [];
  models: Array<{ id: number; name: string }> = [];
  years: Array<{ id: number; year: number }> = [];



  bodyConditions = ['As New', 'Used', 'Needs some fixes'];
  partsConditions = ['New', 'Used'];
  vehicleCareOptions = ['Wakeel', 'USA', 'Europe', 'GCC', 'Customs License'];
  transmissionTypes = ['Automatic', 'Manual', 'Semi-Automatic'];
  steps = [
    { title: 'Filling Product Details', subtitle: 'Please provide your name and email' },
    { title: 'Ad & Contact Details', subtitle: 'Details needed for customers to contact you' },
    { title: 'Checkout', subtitle: 'Start collaborating with your team' }
  ];
  uploadedImages: string[] = [];
  maxImages = 10;

  countries = [
    { id: 'uae', name: 'United Arab Emirates' },
    { id: 'qatar', name: 'Qatar' },
    { id: 'ksa', name: 'Saudi Arabia' }
  ];

  selectedType: 'motorcycle' | 'bike-part' | 'license-plate' | null = null;
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


  constructor(
    private fb: FormBuilder,
    private listingService: ListingService
  ) {
    this.postingAnAd = this.fb.group({

    })
  }
  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      listing_type_id: [1, Validators.required],
      vehicleType: ['motorcycle', Validators.required],
      images: [[],],
      // brand: ['', Validators.required],
      // model: ['', Validators.required],
      // modelYear: ['', Validators.required],
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
      // brand: ['', Validators.required],
      // model: ['', Validators.required],
      // modelYear: ['', Validators.required],
      condition: ['new', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
    this.adDetailsForm = this.fb.group({
      adName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      contactMethods: this.fb.group({
        direct: [false],
        soom: [false],
        phone: [false],
        whatsapp: [false]
      }, {
        validators: [this.atLeastOneContactMethodValidator]
      }),
      price: ['', [Validators.required, Validators.min(1)]],
      city: ['', Validators.required],
      sellerType: ['', Validators.required] // ✅ use a single control here

      // middleman: ['', Validators.required],
      // owner: ['', Validators.required]
    });
this.loadBrands();
    // // this.createVehicleForm();
    // this.createAdDetailsForm();
    // this.createCheckoutForm();
    // if(this.selectedVehicleType === 1){
    //   this.createVehicleForm();
    // }
    // else if (this.selectedVehicleType === 2) {
    //   this.createbikePartForm();
    // }else {
    //   this.createLicensePlateForm()
    // }
    // this.loadBrands(); // ✅ Add this
  }

  selectType(type: 'motorcycle' | 'bike-part' | 'license-plate') {
    this.selectedType = type;
    console.log('this.selectedType: ', this.selectedType);
  }
  highlightInvalidControls(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.invalid) {
        console.warn(`Invalid control: ${key}`, control.errors);
      }
    });
  }

  // createVehicleForm(): void {
  //   this.vehicleForm = this.fb.group({
  //     listing_type_id: [1, Validators.required],
  //     vehicleType: ['motorcycle', Validators.required],
  //     images: [[],],
  //     brand: ['', Validators.required],
  //     model: ['', Validators.required],
  //     modelYear: ['', Validators.required],
  //     bodyCondition: ['As New', Validators.required],
  //     isModified: ['No', Validators.required],
  //     hasInsurance: ['Yes', Validators.required],
  //     condition: ['Used', Validators.required],
  //     vehicleCare: ['Wakeel', Validators.required],
  //     engineCapacity: ['', [Validators.required, Validators.min(1)]],
  //     kilometer: ['', [Validators.required, Validators.min(0)]],
  //     transmission: ['Automatic', Validators.required]
  //   });
  // }

  createbikePartForm(): void {
    this.bikeForm = this.fb.group({
      listing_type_id: [2, Validators.required],
      images: [[],],
      // brand: ['', Validators.required],
      // model: ['', Validators.required],
      // modelYear: ['', Validators.required],
      condition: ['new', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  createLicensePlateForm(): void {
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
  createAdDetailsForm(): void {
    this.adDetailsForm = this.fb.group({
      adName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      contactMethods: this.fb.group({
        direct: [false],
        soom: [false],
        phone: [false],
        whatsapp: [false]
      }, {
        validators: [this.atLeastOneContactMethodValidator]
      }),
      price: ['', [Validators.required, Validators.min(1)]],
      city: ['', Validators.required],
      middleman: ['', Validators.required],
      owner: ['', Validators.required]
    });
  }
  goToStep(step: number) {
    this.currentStep = step;
  }
  createCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }
  // Custom validator to ensure at least one contact method is selected
  atLeastOneContactMethodValidator(group: FormGroup): { [key: string]: boolean } | null {
    const direct = group.get('direct')?.value;
    const soom = group.get('soom')?.value;
    const phone = group.get('phone')?.value;
    const whatsapp = group.get('whatsapp')?.value;

    return (direct || soom || phone || whatsapp) ? null : { 'noContactMethod': true };
  }


  loadBrands() {
    this.listingService.getMotorcycleFilters().subscribe(res => {
      this.brands = res.data.brands;
      console.log('Brands:', this.brands);
    });
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

get contactMethodsFormGroup(): FormGroup {
  return this.adDetailsForm.get('contactMethods') as FormGroup;
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
      console.log('Years data:', res.data.years); // Check what you're receiving
      this.years = res.data.years.map((y: any) => ({
        id: y.id,
        year: y.year
      }));
      console.log('Processed years:', this.years); // Verify the processed data
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

  selectVehicleType(type: number): void {
    this.selectedVehicleType = type;
    this.vehicleForm.patchValue({ listing_type_id: type });
    this.vehicleForm.patchValue({ vehicleType: type });
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

  selectSellerType(type: string): void {
    this.adDetailsForm.patchValue({ sellerType: type });
  }

  toggleContactMethod(method: string): void {
    const contactMethods = this.adDetailsForm.get('contactMethods');
    const currentValue = contactMethods?.get(method)?.value;
    contactMethods?.get(method)?.setValue(!currentValue);
  }

  nextStep() {
    // This now only handles step 2
    console.log('clicked');
    if (this.currentStep === 2 && this.adDetailsForm.valid) {
      // const adDetailsForm = this.adDetailsFormComponent.form;
      // this.adDetailsFormComponent.markAllAsTouched();
      this.currentStep++
      console.log('adDetails',this.adDetailsForm.value);

      // if (adDetailsForm.valid) {
      //   this.submitForm();
      // }
    }
  }

  goToNextStep() {
    console.log('click');
    if(this.selectedVehicleType === 1){
    if (this.vehicleForm.valid && this.uploadedImages.length >= 4) {
      this.currentStep++;
      console.log('vehicleForm',this.vehicleForm.value);
    } else {
      this.vehicleForm.markAllAsTouched();
    }
  } else if (this.selectedVehicleType === 2){
    if (this.bikeForm.valid && this.uploadedImages.length >= 4) {
      this.currentStep++;
      console.log('bikeForm',this.bikeForm.value);
    } else {
      this.bikeForm.markAllAsTouched();
    }
  }
  }

  markCurrentFormTouched(): void {
    const form = this.currentStep === 1 ? this.vehicleForm :
                 this.currentStep === 2 ? this.adDetailsForm :
                 this.checkoutForm;

    form.markAllAsTouched();
  }


  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }



  prepareFormData(): any {
    const vehicleData = this.vehicleForm.value;
    const adData = this.adDetailsForm.value;
    const contactMethods = adData.contactMethods || {};

    // Process images
    const processedImages = vehicleData.images ? vehicleData.images.map((img: string) => {
      if (img && img.startsWith('data:image')) {
        return img.split(',')[1];
      }
      return img;
    }) : [];

    // Handle contacting channels
    const contactingChannels = [];
    if (contactMethods.phone) contactingChannels.push('phone');
    if (contactMethods.whatsapp) contactingChannels.push('whatsapp');

    return {
      listing_type_id: this.vehicleOptions.find(option => option.listing_type_id === this.selectedVehicleType)?.listing_type_id,
      title: adData.adName,
      description: adData.description,
      price: parseFloat(adData.price) || 0,
      contacting_channel: contactingChannels.join(',') || 'none',
      allow_submission: contactMethods.soom,
      seller_type: adData.sellerType === 'middleman' ? 'middleman' : 'owner',
      category_id: 1,
      brand_id: parseInt(vehicleData.brand, 10),
      model_id: parseInt(vehicleData.model, 10),
      year_id: parseInt(vehicleData.modelYear, 10), // This will now be the year ID
      type_id: 7,
      engine: vehicleData.engineCapacity.toString(),
      mileage: parseInt(vehicleData.kilometer, 10),
      body_condition: vehicleData.bodyCondition,
      modified: vehicleData.isModified === 'Yes' || vehicleData.isModified === true,
      insurance: vehicleData.hasInsurance === 'Yes' || vehicleData.hasInsurance === true,
      general_condition: vehicleData.condition,
      vehicle_care: vehicleData.vehicleCare,
      transmission: vehicleData.transmission,
      // images: processedImages
      images:[]
    };
  }

  submitForm(): void {
    if (this.vehicleForm.valid && this.adDetailsForm.valid) {
      this.isSubmitting = true;
      this.submissionError = false;

      const formData = this.prepareFormData();

      console.log('Prepared form data:', formData);

      let apiCall;
      switch (this.selectedVehicleType) {
        case 1:
          apiCall = this.listingService.createMotorcycleListing(formData);
          break;
        case 2:
          apiCall = this.listingService.createBikePartListing(formData);
          break;
        case 3:
          apiCall = this.listingService.createLicensePlateListing(formData);
          break;
        default:
          this.isSubmitting = false;
          this.submissionError = true;
          this.errorMessage = 'Invalid vehicle type selected';
          return;
      }

      apiCall.subscribe({
        next: (response) => {
          console.log('Form submitted successfully:', response);
          this.isSubmitting = false;
          this.submissionSuccess = true;
          this.currentStep = 3;
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          this.isSubmitting = false;
          this.submissionError = true;
          this.errorMessage = error.message || 'Failed to submit listing. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid');
      this.vehicleForm.markAllAsTouched();
      this.adDetailsForm.markAllAsTouched();
      this.highlightInvalidControls(this.vehicleForm);
      this.highlightInvalidControls(this.adDetailsForm);
    }
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






  // goToNextStep() {
  //   console.log('Parent received nextStepRequested event');
  //   if (this.currentStep < this.maxSteps) {
  //     this.currentStep++;
  //     console.log('Current step updated to:', this.currentStep);
  //   }
  // }

  // Make sure onProductDetailsSubmit is also working correctly
  onProductDetailsSubmit(formData: any) {
    console.log('Parent received form data:', formData);
    this.vehicleFormData = formData;
    // Only update the vehicle form if it exists
    if (this.vehicleForm) {
      this.vehicleForm.patchValue(formData);
    }
  }
}
