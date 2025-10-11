import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../../postingAdd/product-form/listingService/listing-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-garage',
  standalone: true,
  imports: [ ReactiveFormsModule,
    CommonModule],
  templateUrl: './my-garage.component.html',
  styleUrl: './my-garage.component.css'
})
export class MyGarageComponent implements OnInit {

  vehicleForm: FormGroup;


  constructor(private listingService : ListingService, private fb: FormBuilder){


     this.vehicleForm = this.fb.group({
      type: ['', Validators.required],
      make: ['', Validators.required],
      year: ['', Validators.required],
      model: ['', Validators.required]
    });
  };

  ngOnInit(){


    this.getMyGarage();

  };


onSubmit() {
  if (this.vehicleForm.valid) {
    console.log(this.vehicleForm.value);
    
    this.listingService.postMyGarage(this.vehicleForm.value).subscribe({
      next: (res) => {
        console.log('Vehicle saved:', res);
        // Optionally refresh the garage list
        this.getMyGarage();
      },
      error: (err) => {
        console.error('Error saving vehicle:', err);
      }
    });
  }
}
  getMyGarage(){
    this.listingService.getMyGarage().subscribe({
      next: (res) => {
        console.log('My Garage:', res);
      },
      error: (err) => {
        console.error('Error fetching garage:', err);
      }
    });
        // The API response has the wishlist items under 'data' property            
  }
}
