import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../../main-products-page/listingProduct.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';



export interface DraftListing {
  id: number;
  title: string;
  description: string;
  price: string;
  status: string;
  step: number;
  listing_type_id: number;
  category: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
  };
  images: {
    id: number;
    image_url: string;
  }[];
  motorcycle?: {
    brand_id: number;
    model_id: number;
    year_id: number;
    type_id: number;
    engine: string;
    mileage: number;
    body_condition: string;
    modified: number;
    insurance: number;
    general_condition: string;
    vehicle_care: string;
    transmission: string;
  };
}


@Component({
  selector: 'app-draft-product',
  standalone:true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './draft-product.component.html',
  styleUrl: './draft-product.component.css'
})
export class DraftProductComponent implements OnInit{

  drafts: DraftListing[] = [];

  constructor(private listingService: ListingService, private router : Router){}

 ngOnInit(): void {
  this.listingService.getDraftListings().subscribe({
    next: (response) => {
      if (response && Array.isArray(response.data)) {
        this.drafts = response.data;
      } else {
        console.warn('Unexpected response format:', response);
        this.drafts = [];
      }
    },
    error: (err) => {
      console.error('Failed to load drafts', err);
    }
  });
}


// ngOnInit(): void {
//   this.listingService.getDraftListings().subscribe({
//     next: (data) => {
//       if (Array.isArray(data)) {
//         this.drafts = data;
//       } else if (data && Array.isArray(data)) {
//         this.drafts = data.data;
//       } else {
//         console.warn('Unexpected response:', data);
//         this.drafts = [];
//       }
//     },
//     error: (err) => {
//       console.error('Failed to load drafts', err);
//     }
//   });
// }
// continueDraft(draftId: number) {
//   this.router.navigate(['/add-product', draftId]); // or whatever route for continuing
// }
continueDraft(draftId: number) {
  this.router.navigate(['/add-product'], {
    queryParams: { draftId: draftId }
  });
}


}
