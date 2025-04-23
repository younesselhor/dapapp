

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
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

    FormsModule,
    SelectModule,
    DropdownModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Output() menuSelected = new EventEmitter<string>();

  selectMenu(menu: string) {
    this.menuSelected.emit(menu);
  }

subNavItems = signal<{id:number, name: string, path:string}[]>([]);

userName: string = '';
cities: ICity[] | undefined;
showDropdown = false;

    selectedCity: ICity | undefined;



isLoggedIn = false;

constructor(private router: Router) {}
ngOnInit() {
  this.cities = [
          { name: 'Riyadh', code: 'RYD' },
          { name: 'Jeddah', code: 'JED' },
          { name: 'Dammam', code: 'DAM' }
        ];


  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    this.isLoggedIn = true;
    this.userName = JSON.parse(user).first_name;
    console.log('user',this.userName);
  }else{
    console.log( 'not logged in');
  }
}

navigateToProfile(): void {
  this.showDropdown = false;
  // Navigate to profile page
  this.router.navigate(['/account']);
}

toggleDropdown(): void {
  this.showDropdown = !this.showDropdown;
}

logout() {
  localStorage.clear();
  this.isLoggedIn = false;
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
}





