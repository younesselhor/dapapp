import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'plates',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'spare-parts',
    loadComponent: () => import('./spare-plates-details/spare-plates-details.component').then(m => m.SparePlatesDetailsComponent)
  },
  {
    path: 'motorcycles',
    loadComponent: () => import('./motorcycles-details/motorcycles-details.component').then(m => m.MotorcyclesDetailsComponent)
  },
  {
    path: 'accessories',
    loadComponent: () => import('./components/accessories/accessories.component').then(m => m.AccessoriesComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'account',
    loadComponent: () => import('./components/account/account/account.component').then(m => m.AccountComponent)
  },
  {
    path: 'add-product',
    loadComponent: () => import('./components/postingAdd/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'listing/:id', 
    loadComponent: () => import('./components/main-products-page/main-products-page.component').then(m => m.MainProductsPageComponent)
  }
];