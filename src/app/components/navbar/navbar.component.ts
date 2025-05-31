

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../services/auth.service';
import { AuthUserDetails, MeResponse } from '../../interfaces/user-interface';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';


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
    DropdownModule,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Output() menuSelected = new EventEmitter<string>();


subNavItems = signal<{id:number, name: string, path:string}[]>([]);
userName: string = '';
cities: ICity[] | undefined;
showDropdown = false;
mobileMenuOpen = false;
selectedCity: ICity | undefined;
currentUser: AuthUserDetails | undefined
isLoggedIn = false;

// constructor(private router: Router,private auth: AuthService,  private cookieService: CookieService,private translate: TranslateService) {
//    this.translate.setDefaultLang('en');
//    const savedLang = localStorage.getItem('lang') || 'en';
//   this.translate.use(savedLang);
// }
constructor(
    private router: Router,
    private auth: AuthService,
    private cookieService: CookieService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang('en');
    
    // Only access localStorage on browser side
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') || 'en';
      this.translate.use(savedLang);
    }
  }
ngOnInit() {
  this.auth.isLoggedIn$.subscribe((loggedIn) => {
    this.isLoggedIn = loggedIn;
    if(loggedIn){
      this.auth.fetchUserProfileOnce();
    this.auth.userProfile$.subscribe((profile) => {
      if( profile && profile.user){
       this.currentUser = profile.user;
       this.userName = profile.user.first_name;
      }
    });
    }else{
      this.currentUser = undefined;
      this.userName = '';
    }
  });

  this.cities = [
          { name: 'Riyadh', code: 'RYD' },
          { name: 'Jeddah', code: 'JED' },
          { name: 'Dammam', code: 'DAM' }
        ];
}


// switchLang(lang: string) {
//   this.translate.use(lang);
//   localStorage.setItem('lang', lang);
// }
 switchLang(lang: string): void {
    this.translate.use(lang);
    
    // Only access localStorage on browser side
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }

selectMenu(menu: string) {
  this.menuSelected.emit(menu);
}

navigateToProfile(): void {
  this.showDropdown = false;

  this.router.navigate(['/account']);
}

toggleDropdown(): void {
  this.showDropdown = !this.showDropdown;
}


toggleMobileMenu(): void {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}
// logout() {
//   this.auth.logout();
//   this.router.navigate(['/login']);
//   this.isLoggedIn = false;
// }
logout(): void {
  this.auth.logout().subscribe({
    next: () => {
      this.cookieService.delete('token', '/');
      localStorage.clear();
      sessionStorage.clear();
      this.isLoggedIn = false;  // Update the login status here
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Logout failed', err);
      // You can show an error message to the user if needed
    }
  });
}

}





