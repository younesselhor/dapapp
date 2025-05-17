import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';


interface Motorcycle {
  id: number;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
}
@Component({
  selector: 'app-used-moto-cycles-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './used-moto-cycles-section.component.html',
  styleUrl: './used-moto-cycles-section.component.css'
})
export class UsedMotoCyclesSectionComponent implements OnInit {
  // @ViewChild('motoSection') motoSection!: ElementRef;

  motorcycles: Motorcycle[] = [
    // {
    //   id: 1,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 55000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/moto.png'
    // },
    // {
    //   id: 2,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 55000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/moto.png'
    // },
    // {
    //   id: 3,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 55000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/moto.png'
    // },
  ];

  constructor(private listings : ListingByCatService) {}
  ngOnInit(): void {
this.getMotoresycles();
  }
  getMotoresycles() {
    this.listings.getMotorcyclesByCategory().subscribe((res: any) => {
      console.log('res', res);
      this.motorcycles = res;
      console.log('this.motorcycles: ', this.motorcycles);
    });
   }
  }
