import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Plate {
  id: number;
  country: string;
  price: number;
  currency: string;
  imageUrl: string;
}
@Component({
  selector: 'app-plates-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plates-section.component.html',
  styleUrl: './plates-section.component.css'
})
export class PlatesSectionComponent {

  plates: Plate[] = [
    {
      id: 1,
      country: 'SAUDI ARABIA',
      price: 700,
      currency: 'SAR',
      imageUrl: '/pictures/plates.png'
    },
    {
      id: 2,
      country: 'UNITED ARAB EMIRATES',
      price: 1200,
      currency: 'AED',
      imageUrl: '/pictures/plates.png'
    },
    {
      id: 3,
      country: 'SAUDI ARABIA',
      price: 700,
      currency: 'SAR',
      imageUrl: '/pictures/plates.png'
    }
  ];
}
