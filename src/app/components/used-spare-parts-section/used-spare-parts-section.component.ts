import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';
import { animate, style, transition, trigger } from '@angular/animations';

interface SparePart {
  id: number;
  title: string;
  price: string; // Changed from number to string since API returns string
  currency?: string; // Make optional since API doesn't return this
  images: string[]; // Changed from imageUrl to images array
  description?: string;
  created_at?: string;
  city?: string;
  country?: string | null;
  wishlist?: boolean;
}

@Component({
  selector: 'app-used-spare-parts-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './used-spare-parts-section.component.html',
  styleUrls: ['./used-spare-parts-section.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class UsedSparePartsSectionComponent implements OnInit {
  currentSlide = 0;
  itemsPerSlide = 3;
  spareParts: SparePart[] = [];
  slideDirection: 'left' | 'right' = 'right';

  constructor(private listinbyCat: ListingByCatService) {}

  ngOnInit(): void {
    this.getBikePart();
  }


   truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  getBikePart() {
    this.listinbyCat.getBikePartByCategory().subscribe((res: any) => {
      this.spareParts = res;
      console.log('this.spareParts: ', this.spareParts);
    });
  }

  get visibleParts() {
    const start = this.currentSlide * this.itemsPerSlide;
    return this.spareParts.slice(start, start + this.itemsPerSlide);
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.slideDirection = 'right';
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.slideDirection = 'left';
      this.currentSlide--;
    }
  }

  goToSlide(index: number) {
    this.slideDirection = index > this.currentSlide ? 'right' : 'left';
    this.currentSlide = index;
  }

  get totalSlides() {
    return Math.ceil(this.spareParts.length / this.itemsPerSlide);
  }
}