// import { Component, OnInit } from '@angular/core';
// import { NavigationService } from '../../services/navigationservice';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-sub-nav',
//   standalone:true,
//   imports: [CommonModule],
//   templateUrl: './sub-nav.component.html',
//   styleUrl: './sub-nav.component.css'
// })
// export class SubNavComponent implements OnInit {
//   subNavItems: string[] = [];

//   constructor(private navigationService: NavigationService) {}

//   ngOnInit() {
//     this.navigationService.activeNav$.subscribe(nav => {
//       this.subNavItems = this.navigationService.getSubNavItems(nav);
//     });
//   }
// }


import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';



interface sub_menu {
  name: string;
  path?: string | Function;
  isFunction?: boolean;
}
interface ICity{
  name: string;
  code: string;
}

interface menu_item {
  name: string;
  path?: string;
  sub_menu?: sub_menu[];
  // slug?: string;
  isMobileCurrency?: boolean;
}
interface IsubNavItems{
  id:number;
  name:string;
}
// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     RouterLink,
//     FormsModule,
//     SelectModule,
//     DropdownModule
//   ],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent implements OnInit {


  @Component({
  selector: 'app-sub-nav',
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    SelectModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './sub-nav.component.html',
  styleUrl: './sub-nav.component.css'
})
export class SubNavComponent implements OnInit {


  @Input() selectedMenu: string = '';


  getSubMenuItems():{ name: string; path: string }[]{
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


      //    'Aftermarket', 'Section 1', 'Section 2', 'Section 3'],

      // 'marketplace': ['Marketplace 1', 'Marketplace 2', 'Marketplace 3', 'Marketplace 4'],
      // 'usedParts': ['Motorcycles', 'Spare Parts', 'plates', 'Used Parts 4'],
      // 'services': ['Services 1', 'Services 2', 'Services 3', 'Services 4'],
      // 'guide': ['Guide 1', 'Guide 2', 'Guide 3', 'Guide 4'],
      // 'about-us': ['About Us 1', 'About Us 2', 'About Us 3', 'About Us 4'],
      // 'contact-us': ['Contact Us 1', 'Contact Us 2', 'Contact Us 3', 'Contact Us 4']

    return menuItems[this.selectedMenu] || [];
  }
// menu: menu_item[] = [
// {
//   name: 'Home',
//   path: '',
//   sub_menu:[
//     {
//       name:'Helmets',
//       path: 'helmets'
//     },
//     {
//       name:'Riding Gear ',
//       path: 'ridinggear '
//     },
//     {
//       name:'Accessories',
//       path: 'accessories'
//     },
//     {
//       name:'Tires',
//       path: 'tires'
//     },
//     {
//       name:'Aftermarket',
//       path: 'aftermarket'
//     },
//     {
//       name:'Section 1',
//       path: 'Section'
//     },
//     {
//       name:'Section 2',
//       path: 'Section2'
//     },
//     {
//       name:'Section 3',
//       path: 'Section3'
//     }
//   ]
// },
// {
//   name:'Marketplace',
//   path: 'marketplace'
// },
// {
//   name : 'Used Parts',
//   path: 'usedparts',
//   sub_menu:[
//     {
//       name:'Motorcycles',
//       path: 'motorcycles'
//     },
//     {
//       name:'Spare Parts',
//       path: 'spareparts',

//     },
//     {
//       name:'Plates',
//       path: 'plates'
//     }
//   ]
// },
// {
//   name: 'Services',
//   path: 'services'
// },
// {
//   name:'Guide',
//   path: 'guide'
// }
// ];

//  showSubMenu: boolean = false;
//  showSubMenuHome: boolean = false;
//  menuOpen = false;

//   toggleSubMenu() {
//     this.showSubMenu = !this.showSubMenu;
//     this.showSubMenuHome = false;

//   }
//   toggleSubMenuHome() {
//     this.showSubMenuHome = !this.showSubMenuHome;
//     this.showSubMenu = false;

//   }

//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//   }
subNavItems = signal<{id:number, name: string, path:string}[]>([]);
// subNavItems : IsubNavItems []= [
//   {id: 1, name: 'Helmets', path:'Helmets'},
//   {id: 2, name: 'Riding Gear', path:'Helmets'},
//   {id: 3, name: 'Accessories', path:'Helmets'},
//   {id: 4, name: 'Tires', path:'Helmets'},
//   {id: 5, name: 'Aftermarket', path:'Helmets'},
//   {id: 6, name: 'Section 1', path:'Helmets'},
//   {id: 7, name: 'Section 2', path:'Helmets'},
//   {id: 8, name: 'Section 3', path:'Helmets'}
// ];
// cities : ICity [] = [
//   { name: 'Riyadh', code: 'RYD' },
//   { name: 'Jeddah', code: 'JED' },
//   { name: 'Dammam', code: 'DAM' }
// ];

// selectedCity: any;
value :string = '';
userName: string = 'Ahmed';
cities: ICity[] | undefined;

    selectedCity: ICity | undefined;

    ngOnInit() {
        this.cities = [
          { name: 'Riyadh', code: 'RYD' },
          { name: 'Jeddah', code: 'JED' },
          { name: 'Dammam', code: 'DAM' }
        ];
    }

changeSection(section: string) {
  if (section === 'home') {
    this.subNavItems.set([{id:1,name:'Helmets', path:'Helmets'},{ id:2,name:'Riding Gear', path:'RidingGear'}, {id:3,name:'Accessories', path:'accessories'}, {id:4,name:'Tires', path:'Tires'}, {id:5,name:'Aftermarket', path:'Aftermarket'}, {id:6,name:'Section 1', path:'Section'}, {id:7,name:'Section 2', path:'Section'}, {id:8,name:'Section 3', path:'Section'}]);
  } else if (section === 'usedParts') {
    this.subNavItems.set([{id:1,name:'Motorcycles', path:'Helmets'}, {id:2,name:'Spare Parts', path:'Helmets'}, {id:3,name:'Plates', path:'plates'}]);
  } else {
    this.subNavItems.set([]);
  }
}
}





