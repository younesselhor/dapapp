import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SubNavItems {
  [key: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private subNavItems: SubNavItems = {
    'Home': ['Helmets', 'Riding Gear', 'Accessories', 'Tires', 'Aftermarket', 'Section 1', 'Section 2', 'Section 3'],
    'Used Parts': ['Motorcycles', 'Spare Parts', 'Plates'],
    'Marketplace': ['Helmets', 'Riding Gear', 'Accessories', 'Tires', 'Aftermarket', 'Section 1', 'Section 2', 'Section 3'],
    'Services': ['Maintenance', 'Repair', 'Custom Work'],
    'Guide': ['Buying Guide', 'Maintenance Guide', 'Safety Tips']
  };

  private activeNavSubject = new BehaviorSubject<string>('Home');
  activeNav$ = this.activeNavSubject.asObservable();

  setActiveNav(nav: string) {
    this.activeNavSubject.next(nav);
  }

  getSubNavItems(nav: string): string[] {
    return this.subNavItems[nav] || [];
  }
}
