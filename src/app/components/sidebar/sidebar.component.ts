// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-sidebar',
//   imports: [],
//   templateUrl: './sidebar.component.html',
//   styleUrl: './sidebar.component.css'
// })
// export class SidebarComponent {

// }

// sidebar.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isDigitsOpen: boolean = true;
  isCountryOpen: boolean = true;
  isPlateCodeOpen: boolean = true;

  digits = [
    { value: 2, count: 18, checked: false },
    { value: 3, count: 22, checked: false },
    { value: 4, count: 23, checked: false }
  ];

  countries = [
    { code: 'KSA', name: 'KSA', count: 18, checked: false },
    { code: 'UAE', name: 'UAE', count: 32, checked: false },
    { code: 'Kuwait', name: 'Kuwait', count: 23, checked: false },
    { code: 'Bahrain', name: 'Bahrain', count: 23, checked: false }
  ];

  plateCodes = [
    { value: 'A', count: 9, checked: false },
    { value: 'B', count: 17, checked: false },
    { value: 'C', count: 50, checked: false },
    { value: 'D', count: 6, checked: false }
  ];



  priceRange = {
    min: 0,
    max: 1000
  };

  toggleDigits() {
    this.isDigitsOpen = !this.isDigitsOpen;
  }

  toggleCountry() {
    this.isCountryOpen = !this.isCountryOpen;
  }

  togglePlateCode() {
    this.isPlateCodeOpen = !this.isPlateCodeOpen;
  }


  onMinSliderChange(event: any) {
    const value = parseInt(event.target.value);
    // Ensure min doesn't exceed max
    if (value > this.priceRange.max) {
      this.priceRange.min = this.priceRange.max;
    } else {
      this.priceRange.min = value;
    }
  }

  onMaxSliderChange(event: any) {
    const value = parseInt(event.target.value);
    // Ensure max doesn't go below min
    if (value < this.priceRange.min) {
      this.priceRange.max = this.priceRange.min;
    } else {
      this.priceRange.max = value;
    }
  }

  onMinInputChange() {
    // Validate min input
    if (this.priceRange.min < 0) {
      this.priceRange.min = 0;
    } else if (this.priceRange.min > 1000) {
      this.priceRange.min = 1000;
    }

    // Ensure min doesn't exceed max
    if (this.priceRange.min > this.priceRange.max) {
      this.priceRange.max = this.priceRange.min;
    }
  }

  onMaxInputChange() {
    // Validate max input
    if (this.priceRange.max < 0) {
      this.priceRange.max = 0;
    } else if (this.priceRange.max > 1000) {
      this.priceRange.max = 1000;
    }

    // Ensure max doesn't go below min
    if (this.priceRange.max < this.priceRange.min) {
      this.priceRange.min = this.priceRange.max;
    }
  }
}
