import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';


interface Motorcycle {
  id: number;
  title: string;
  price: number;
  currency: string;
  // imageUrl: string;
  images: string[];
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

  currentSlide = 0;
  itemsPerSlide = 3;
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

  constructor(private listings : ListingByCatService, private router : Router) {}
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

   get visibleMotorcycles() {
    const start = this.currentSlide * this.itemsPerSlide;
    return this.motorcycles.slice(start, start + this.itemsPerSlide);
  }

      viewListing(id: number): void {
  this.router.navigate(['/listing', id]);
  console.log('click');
}
  nextSlide() {
    const maxSlides = Math.ceil(this.motorcycles.length / this.itemsPerSlide) - 1;
    if (this.currentSlide < maxSlides) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  get totalSlides() {
    return Math.ceil(this.motorcycles.length / this.itemsPerSlide);
  }
  }
