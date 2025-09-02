import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';


import { AuthService } from '../../services/auth.service'; // Update path if needed
import { Subscription } from 'rxjs';
import { ListingService } from '../postingAdd/product-form/listingService/listing-service.service';
import { LocationSService } from '../../services/location-s.service';
// import { ListingService } from '../main-products-page/listingProduct.service';


interface ICountry {
  id: number;
  name: string;
  code: string;
}

interface ICity {
  name: string;
  code: string;
}

@Component({
  selector: 'app-sub-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './sub-nav.component.html',
  styleUrl: './sub-nav.component.css'
})
export class SubNavComponent implements OnInit, OnChanges {
  @Input() selectedMenu: string = '';

  value: string = '';

  selectedCountry: string = ''; // ← country code like 'SA', 'AE', 'MA'
  countries: ICountry[] = [];
  allCities: any[] = [];
  isLoggedIn = false;

   private userSub: Subscription | undefined;
    constructor(private authService: AuthService, private listingService: ListingService, private locationService: LocationSService) {}


  // Using a method instead of a property for reactive updates
  getSubMenuItems(): { name: string; path: string }[] {
    const menuItems: { [key: string]: { name: string; path: string }[] } = {
      'home': [
        { name: 'Helmets', path: '/helmets' },
        { name: 'Riding Gear', path: '/riding-gear' },
        { name: 'Accessories', path: '/accessories' },
        { name: 'Tires', path: '/tires' },
        { name: 'Aftermarket', path: '/aftermarket' },
        { name: 'Section 1', path: '/section-1' },
        { name: 'Section 2', path: '/section-2' },
        { name: 'Section 3', path: '/section-3' }
      ],
      'marketplace': [
        { name: 'Marketplace 1', path: '/marketplace-1' },
        { name: 'Marketplace 2', path: '/marketplace-2' },
        { name: 'Marketplace 3', path: '/marketplace-3' },
        { name: 'Marketplace 4', path: '/marketplace-4' }
      ],
      'usedParts': [
        { name: 'Motorcycles', path: '/motorcycles' },
        { name: 'Spare Parts', path: '/spare-parts' },
        { name: 'Plates', path: '/plates' },
      ],
      'services': [
        { name: 'Services 1', path: '/services-1' },
        { name: 'Services 2', path: '/services-2' },
        { name: 'Services 3', path: '/services-3' },
        { name: 'Services 4', path: '/services-4' }
      ],
      'guide': [
        { name: 'Guide 1', path: '/guide-1' },
        { name: 'Guide 2', path: '/guide-2' },
        { name: 'Guide 3', path: '/guide-3' },
        { name: 'Guide 4', path: '/guide-4' }
      ],
      'about-us': [
        { name: 'About Us 1', path: '/about-us-1' },
        { name: 'About Us 2', path: '/about-us-2' },
        { name: 'About Us 3', path: '/about-us-3' },
        { name: 'About Us 4', path: '/about-us-4' }
      ],
      'contact-us': [
        { name: 'Contact Us 1', path: '/contact-us-1' },
        { name: 'Contact Us 2', path: '/contact-us-2' },
        { name: 'Contact Us 3', path: '/contact-us-3' },
        { name: 'Contact Us 4', path: '/contact-us-4' }
      ]
    };

    return menuItems[this.selectedMenu] || [];
  }




//   ngOnInit() {

//       this.authService.isLoggedIn$.subscribe(status => {
//     this.isLoggedIn = status;
//   });

//     this.getCountry();
//     this.loadCountries();

//     this.userSub = this.authService.currentUser$.subscribe((user) => {
//       if (user?.country) {
//         const found = this.countries.find(c => c.name.toLowerCase() === user.country.toLowerCase());
//         // if (found) {
//         //   this.selectedCountry = found.name;
//         //   console.log(' this.selectedCountry: ',  this.selectedCountry);
//         //   console.log('User country matched:', found.name, '-> code:', found.code);
//         // }
//         if (found) {
//   this.selectedCountry = found.name;
//   this.locationService.setSelectedCountry(found); // 🔥 Notify globally on login

// }

//       }
//     });
//   }

//   loadCountries() {
//     this.listingService.getCityList().subscribe((res) => {
//       // this.countries = res.countries;
//       console.log('this.countries : ', this.countries );
//       this.allCities = res.cities;
//     });
//   }

//   getCountry() {
//   this.listingService.getCountry().subscribe((res) => {
//     // Convert API response { country: "Morocco", continent: "...", ip: "..." }
//     this.countries = [{
//       id: 4,                     // you can generate or omit if not used
//       name: res.country,
//       code: res.continent || ''  // or use some mapping if you want real ISO code
//     }];

//     // auto-select the detected country
//     this.selectedCountry = res.country;
//     // this.locationService.setSelectedCountry(this.countries[0]);

//     console.log('Countries:', this.countries);
//   });
// }

  // getCountry(){
  //   this.listingService.getCountry().subscribe((res) => {
  //     this.countries = res.country;
  //     console.log(' : ',  this.countries);
  //   });
  // }


  ngOnInit() {
  this.authService.isLoggedIn$.subscribe(status => {
    this.isLoggedIn = status;
  });

  // Load all countries first
  this.loadCountries();

  // Then detect user's country and preselect
  this.getCountry();

  this.userSub = this.authService.userProfile$.subscribe((profile) => {
    if (profile?.user?.country_id) {
      const found = this.countries.find(c => c.id === Number(profile.user.country_id));
      if (found) {
        this.selectedCountry = found.name;
        this.locationService.setSelectedCountry(found);
      }
    }
  });
}

loadCountries() {
  this.listingService.getCityList().subscribe((res) => {
    this.countries = res.countries;   // ✅ now the dropdown has full list
    this.allCities = res.cities;
  });
}

getCountry() {
  this.listingService.getCountry().subscribe((res) => {
    // Example response: { country: "Morocco", continent: "AF", ip: "..." }
    const detected = this.countries.find(c => 
      c.name.toLowerCase() === res.country.toLowerCase()
    );

    if (detected) {
      this.selectedCountry = detected.name;
      this.locationService.setSelectedCountry(detected);
    }

  });
}

onCountryChange(event: Event) {
  const selectedName = (event.target as HTMLSelectElement).value;
  const selected = this.countries.find(c => c.name === selectedName);
  if (selected) {
    // this.selectedCountry = selected;
    this.locationService.setSelectedCountry(selected); // 👈 notify the app
  }
}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMenu']) {
      // ...
    }
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}






