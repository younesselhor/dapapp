import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SubNavComponent } from './components/sub-nav/sub-nav.component';
import { AuthService } from './services/auth.service';

// import { SidebarComponent } from './components/sidebar/sidebar.component';
// import { ProductsComponent } from './components/products/products.component';
// import { ProductCardComponent } from './components/product-card/product-card.component';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,NavbarComponent,FooterComponent,SubNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // title = 'dapapp';
  selectedMenu: string = '';

  handleMenuSelection(menu: string) {
    this.selectedMenu = menu;
  }

  // constructor(private authService: AuthService) {}
  constructor(private auth: AuthService) {
    const hasToken = this.auth.getToken();
    this.auth.setLoggedIn(!!hasToken);
  }

  ngOnInit(): void {
  }

}


