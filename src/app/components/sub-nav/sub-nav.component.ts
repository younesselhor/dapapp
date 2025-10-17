import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';


import { AuthService } from '../../services/auth.service'; // Update path if needed
import { Subscription } from 'rxjs';
import { ListingService } from '../postingAdd/product-form/listingService/listing-service.service';
import { LocationSService } from '../../services/location-s.service';
// import { ListingService } from '../main-products-page/listingProduct.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoginModalComponent } from '../login-modal/login-modal.component';


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
    InputTextModule,
    LoginModalComponent
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
  showLoginModal = false;

   private userSub: Subscription | undefined;
    constructor(private authService: AuthService, private listingService: ListingService, private locationService: LocationSService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
    ) {}


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





  ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // ✅ Always load countries first
    this.loadCountries().then(() => {
      // Check localStorage after countries are loaded
      const storedCountry = localStorage.getItem('selectedCountry');
      if (storedCountry) {
        const parsed = JSON.parse(storedCountry);
        this.selectedCountry = parsed.name;
        this.locationService.setSelectedCountry(parsed);
      } else {
        // If no stored country, detect from IP
        this.getCountry();
      }
    });

    // ✅ Handle user login - wait for countries to load
    this.userSub = this.authService.userProfile$.subscribe((profile) => {
      if (profile?.user?.country_id && this.countries.length > 0) {
        const found = this.countries.find(c => c.id === Number(profile.user.country_id));
        if (found) {
          this.selectedCountry = found.name;
          this.locationService.setSelectedCountry(found);
          localStorage.setItem('selectedCountry', JSON.stringify(found));
        }
      } else if (profile?.user?.country_id && this.countries.length === 0) {
        // If countries not loaded yet, wait and retry
        setTimeout(() => {
          const found = this.countries.find(c => c.id === Number(profile.user.country_id));
          if (found) {
            this.selectedCountry = found.name;
            this.locationService.setSelectedCountry(found);
            localStorage.setItem('selectedCountry', JSON.stringify(found));
          }
        }, 500);
      }
    });
  }
}
  

navigateToAddProduct(){
  if(this.isLoggedIn){
    this.router.navigate(['/add-product']);
  } else {
    this.openLoginModal();
  }
}
  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

loadCountries(): Promise<void> {
  return new Promise((resolve) => {
    this.listingService.getCityList().subscribe((res) => {
      this.countries = res.countries;
      this.allCities = res.cities;
      resolve();
    });
  });
}



onCountryChange(event: Event) {
  const selectedName = (event.target as HTMLSelectElement).value;
  const selected = this.countries.find(c => c.name === selectedName);
  if (selected) {
    this.selectedCountry = selected.name; // 👈 sync model
    this.locationService.setSelectedCountry(selected);
    localStorage.setItem('selectedCountry', JSON.stringify(selected));
  }
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



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMenu']) {
      // ...
    }
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}






