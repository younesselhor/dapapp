import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

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
  cities: ICity[] = [
    { name: 'Riyadh', code: 'RUH' },
    { name: 'Jeddah', code: 'JED' },
    { name: 'Dammam', code: 'DMM' }
  ];

  // selectedCity: ICity | undefined;


  selectedCity: ICity = { name: '', code: '' };

  onCityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCode = selectElement.value;
    const foundCity = this.cities.find(city => city.code === selectedCode);
    this.selectedCity = foundCity || { name: '', code: '' };
  }
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
    this.cities = [
      { name: 'Riyadh', code: 'RYD' },
      { name: 'Jeddah', code: 'JED' },
      { name: 'Dammam', code: 'DAM' }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to selectedMenu changes if needed
    if (changes['selectedMenu']) {
      // Additional logic if needed when menu changes
    }
  }
}
