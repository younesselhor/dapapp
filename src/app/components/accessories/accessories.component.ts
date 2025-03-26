import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule,ProductDetailsComponent],
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent {

}
