// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-products',
//   imports: [],
//   templateUrl: './products.component.html',
//   styleUrl: './products.component.css'
// })
// export class ProductsComponent {

// }

// products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ListingByCatService } from '../../services/listingsByCategory/listing-by-cat.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent,SidebarComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  plates: any[] = [];


  constructor(private listingfilter : ListingByCatService){}
  ngOnInit() {
    // Sample data - in a real app, this would come from a service
    // this.plates = [
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'SAUDI ARABIA',
    //     countryCode: 'KSA',
    //     price: '900',
    //     currency: 'SAR'
    //   },
    //   {
    //     number: '10',
    //     letter: 'M',
    //     numberArabic: '١٠',
    //     letterArabic: 'م',
    //     country: 'UNITED ARAB EMIRATES',
    //     countryCode: 'UAE',
    //     price: '700',
    //     currency: 'AED'
    //   },
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'SAUDI ARABIA',
    //     countryCode: 'KSA',
    //     price: '900',
    //     currency: 'SAR'
    //   },
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'SAUDI ARABIA',
    //     countryCode: 'KSA',
    //     price: '900',
    //     currency: 'SAR'
    //   },
    //   {
    //     number: '10',
    //     letter: 'M',
    //     numberArabic: '١٠',
    //     letterArabic: 'م',
    //     country: 'UNITED ARAB EMIRATES',
    //     countryCode: 'UAE',
    //     price: '700',
    //     currency: 'AED'
    //   },
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'KUWAIT',
    //     countryCode: 'KWT',
    //     price: '800',
    //     currency: 'KWD'
    //   },
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'SAUDI ARABIA',
    //     countryCode: 'KSA',
    //     price: '900',
    //     currency: 'SAR'
    //   },
    //   {
    //     number: '10',
    //     letter: 'M',
    //     numberArabic: '١٠',
    //     letterArabic: 'م',
    //     country: 'UNITED ARAB EMIRATES',
    //     countryCode: 'UAE',
    //     price: '700',
    //     currency: 'AED'
    //   },
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'SAUDI ARABIA',
    //     countryCode: 'KSA',
    //     price: '900',
    //     currency: 'SAR'
    //   },
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'SAUDI ARABIA',
    //     countryCode: 'KSA',
    //     price: '900',
    //     currency: 'SAR'
    //   },
    //   {
    //     number: '10',
    //     letter: 'M',
    //     numberArabic: '١٠',
    //     letterArabic: 'م',
    //     country: 'UNITED ARAB EMIRATES',
    //     countryCode: 'UAE',
    //     price: '700',
    //     currency: 'AED'
    //   },
    //   {
    //     number: '777',
    //     letter: 'SBA',
    //     numberArabic: '٧٧٧',
    //     letterArabic: 'س ب ع',
    //     country: 'KUWAIT',
    //     countryCode: 'KWT',
    //     price: '800',
    //     currency: 'KWD'
    //   }
    // ];
    this.licencePlate();
  }

  licencePlate(){
    this.listingfilter.filterLicencePlate().subscribe((res)=>{
      this.plates = res.data;
      console.log('this.plates: ', this.plates);
    })
  }
}
