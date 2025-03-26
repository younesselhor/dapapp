import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,SidebarComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() plateData: any;
}
