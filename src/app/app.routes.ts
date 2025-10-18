import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdSubmissionSuccessComponent } from './ad-submission-success/ad-submission-success.component';
import { AccountTabsComponent } from './components/account/account-tabs/account-tabs.component';
import { accountTabsRoutes } from './components/account/account-tabs/account-tabs.routes';

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
  // {
  //   path: 'account',
  //   loadComponent: () => import('./components/account/account/account.component').then(m => m.AccountComponent)
  // },
  // {
  //   path: 'account',
  //   loadComponent: () =>
  //     import('./components/account/account/account.component').then(
  //       (m) => m.AccountComponent
  //     ),
  //   children: [
  //     {
  //       path: 'account-home',
  //       loadComponent: () =>
  //         import('./components/home-tab/profile-card/profile-card.component').then(
  //           (m) => m.ProfileCardComponent
  //         ),
  //     },
  //     {
  //       path: 'settings',
  //       loadComponent: () =>
  //         import('./components/home-tab/settings/settings.component').then(
  //           (m) => m.SettingsComponent
  //         ),
  //     },
  //     {
  //       path: 'wishlist',
  //       loadComponent: () =>
  //         import('./components/home-tab/saved-vehicles/saved-vehicles.component').then(
  //           (m) => m.SavedVehiclesComponent
  //         ),
  //     },
  //     {
  //       path: 'soom-box',
  //       loadComponent: () =>
  //         import('./components/home-tab/soom-box/soom-box.component').then(
  //           (m) => m.SoomBoxComponent
  //         ),
  //     },
  //     {
  //       path: 'draft',
  //       loadComponent: () =>
  //         import('./components/home-tab/draft-product/draft-product.component').then(
  //           (m) => m.DraftProductComponent
  //         ),
  //     },
  //     // default redirect
  //     { path: '', redirectTo: 'account', pathMatch: 'full' },
  //   ],
  // },




 {
    path: 'account',
    component: AccountTabsComponent,
    canActivateChild: [AuthGuard], // ✅ Protect all child routes
    children: accountTabsRoutes,
  },
  {
    path: 'add-product',
    loadComponent: () => import('./components/postingAdd/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'listing/:id', 
    loadComponent: () => import('./components/main-products-page/main-products-page.component').then(m => m.MainProductsPageComponent),
     canActivate: [AuthGuard] 
  },
    { path: 'submission-success', component: AdSubmissionSuccessComponent },
  // { path: 'payment-processing', component: PaymentProcessingComponent }
];