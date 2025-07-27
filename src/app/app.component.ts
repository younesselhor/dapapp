import { Component, OnInit ,Inject, PLATFORM_ID} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SubNavComponent } from './components/sub-nav/sub-nav.component';
import { AuthService } from './services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { LoginModalComponent } from './components/login-modal.component';
// import { SidebarComponent } from './components/sidebar/sidebar.component';
// import { ProductsComponent } from './components/products/products.component';
// import { ProductCardComponent } from './components/product-card/product-card.component';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,NavbarComponent,FooterComponent,SubNavComponent,TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // title = 'dapapp';
  selectedMenu: string = '';
  //  showLoginModal = false;

  handleMenuSelection(menu: string) {
    this.selectedMenu = menu;
  }

  // constructor(private authService: AuthService) {}
 constructor(
    private auth: AuthService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.translate.setDefaultLang('en');
    //  this.auth.loginModal$.subscribe(() => {
    //   this.showLoginModal = true;
    // });
    // Only access localStorage/tokens on browser side
    if (isPlatformBrowser(this.platformId)) {
      const hasToken = this.auth.getToken();
      this.auth.setLoggedIn(!!hasToken);
    }
  }

  ngOnInit(): void {
  }

}


