

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';



interface sub_menu {
  name: string;
  path?: string | Function;
  isFunction?: boolean;
}

interface menu_item {
  name: string;
  path?: string;
  sub_menu?: sub_menu[];
  // slug?: string;
  isMobileCurrency?: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{
menu: menu_item[] = [
{
  name: 'Home',
  path: '',
  sub_menu:[
    {
      name:'Helmets',
      path: 'helmets'
    },
    {
      name:'Riding Gear ',
      path: 'ridinggear '
    },
    {
      name:'Accessories',
      path: 'accessories'
    },
    {
      name:'Tires',
      path: 'tires'
    },
    {
      name:'Aftermarket',
      path: 'aftermarket'
    },
    {
      name:'Section 1',
      path: 'Section'
    },
    {
      name:'Section 2',
      path: 'Section2'
    },
    {
      name:'Section 3',
      path: 'Section3'
    }
  ]
},
{
  name:'Marketplace',
  path: 'marketplace'
},
{
  name : 'Used Parts',
  path: 'usedparts',
  sub_menu:[
    {
      name:'Motorcycles',
      path: 'motorcycles'
    },
    {
      name:'Spare Parts',
      path: 'spareparts',

    },
    {
      name:'Plates',
      path: 'plates'
    }
  ]
},
{
  name: 'Services',
  path: 'services'
},
{
  name:'Guide',
  path: 'guide'
}
];

 showSubMenu: boolean = false;
 showSubMenuHome: boolean = false;
 menuOpen = false;

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
    this.showSubMenuHome = false;

  }
  toggleSubMenuHome() {
    this.showSubMenuHome = !this.showSubMenuHome;
    this.showSubMenu = false;

  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}





