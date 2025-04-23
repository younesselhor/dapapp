import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,CardModule,ButtonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() plateData: any;
}
