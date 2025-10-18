// account-tabs.routes.ts
import { Routes } from '@angular/router';
import { ProfileCardComponent } from '../home-tab/profile-card/profile-card.component';
import { SettingsComponent } from '../home-tab/settings/settings.component';
import { PaymentCardUserComponent } from '../home-tab/payment-card-user/payment-card-user.component';
import { SoomBoxComponent } from '../home-tab/soom-box/soom-box.component';
import { SavedVehiclesComponent } from '../home-tab/saved-vehicles/saved-vehicles.component';
import { DraftProductComponent } from '../home-tab/draft-product/draft-product.component';
import { MyGarageComponent } from '../home-tab/my-garage/my-garage.component';

export const accountTabsRoutes: Routes = [
  { path: 'account-home', component: ProfileCardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'soom-box', component: SoomBoxComponent },
  { path: 'payment-info', component: PaymentCardUserComponent },
  { path: 'wishlist', component: SavedVehiclesComponent },
  { path: 'draft', component: DraftProductComponent },
  { path: 'my-garage', component: MyGarageComponent },
  { path: '', redirectTo: 'account-home', pathMatch: 'full' }
];
