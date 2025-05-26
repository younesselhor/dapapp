import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-details',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent implements OnInit{
  adDetailsForm!: FormGroup
  constructor(private fb: FormBuilder){

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
    });

  }
  ngOnInit(): void {

  }
  get form() {
    return this.adDetailsForm;
  }

  markAllAsTouched() {
    this.adDetailsForm.markAllAsTouched();
  }
  atLeastOneContactMethodValidator(group: FormGroup): { [key: string]: boolean } | null {
    const direct = group.get('direct')?.value;
    const soom = group.get('soom')?.value;
    const phone = group.get('phone')?.value;
    const whatsapp = group.get('whatsapp')?.value;

    return (direct || soom || phone || whatsapp) ? null : { 'noContactMethod': true };
  }
  get contactMethodsFormGroup(): FormGroup {
    return this.adDetailsForm.get('contactMethods') as FormGroup;
  }

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

}
