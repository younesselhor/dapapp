import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsedMotoCyclesSectionComponent } from '../used-moto-cycles-section/used-moto-cycles-section.component';
import { UsedSparePartsSectionComponent } from '../used-spare-parts-section/used-spare-parts-section.component';
import { PlatesSectionComponent } from '../plates-section/plates-section.component';
import { RecentlyAddedProductsComponent } from "../recently-added-products/recently-added-products.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    UsedMotoCyclesSectionComponent,
    UsedSparePartsSectionComponent,
    PlatesSectionComponent,
    CommonModule,
    // RecentlyAddedProductsComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
