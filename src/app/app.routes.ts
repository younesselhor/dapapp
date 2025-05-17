import { Routes } from '@angular/router';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductsComponent } from './components/products/products.component';
import { AccessoriesComponent } from './components/accessories/accessories.component';
import { LoginComponent } from './components/login/login/login.component';
import { RegisterComponent } from './components/register/register/register.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AccountComponent } from './components/account/account/account.component';
import { ProductFormComponent } from './components/postingAdd/product-form/product-form.component';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'

  },
  {
    path: 'plates',
    component: ProductsComponent
  },
  {
    path: 'accessories',
    component: AccessoriesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path:'account',
    component:AccountComponent
  },
  {
    path: 'add-product',
    component: ProductFormComponent
  }

];
