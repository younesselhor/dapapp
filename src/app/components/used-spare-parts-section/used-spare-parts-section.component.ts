import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface SparePart {
  id: number;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
}

@Component({
  selector: 'app-used-spare-parts-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './used-spare-parts-section.component.html',
  styleUrl: './used-spare-parts-section.component.css'
})
export class UsedSparePartsSectionComponent {

  spareParts: SparePart[] = [
    {
      id: 1,
      title: 'Handlebars',
      price: 700,
      currency: 'SAR',
      imageUrl: '/pictures/usedpart.png'
    },
    {
      id: 2,
      title: 'Gas Tank',
      price: 4000,
      currency: 'SAR',
      imageUrl: '/pictures/usedpart.png'
    },
    {
      id: 3,
      title: 'Gas Tank',
      price: 4000,
      currency: 'SAR',
      imageUrl: '/pictures/usedpart.png'
    }
  ];
}
