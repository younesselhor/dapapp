

import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';



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
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    SelectModule,
    DropdownModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
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





