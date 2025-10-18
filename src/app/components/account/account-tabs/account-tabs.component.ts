import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileCardComponent } from '../home-tab/profile-card/profile-card.component';
import { SavedVehiclesComponent } from '../home-tab/saved-vehicles/saved-vehicles.component';
import { SettingsComponent } from '../home-tab/settings/settings.component';
import { PaymentCardUserComponent } from '../home-tab/payment-card-user/payment-card-user.component';
import { SoomBoxComponent } from '../home-tab/soom-box/soom-box.component';
import { DraftProductComponent } from '../home-tab/draft-product/draft-product.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-tabs',
  imports: [CommonModule, RouterModule],
  standalone:true,
  templateUrl: './account-tabs.component.html',
  styleUrl: './account-tabs.component.css'
})
export class AccountTabsComponent {
  // tabs: string[] = ['Home', 'Settings','SOOM Box','My Ads' ,'Orders', 'Payment Information', 'Addresses', 'My Garage', 'Wishlist','Draft Posting Add'];
  tabs = [
  { label: 'Home', route: 'account-home' },
  { label: 'Settings', route: 'settings' },
  { label: 'SOOM Box', route: 'soom-box' },
  { label: 'My Ads', route: 'my-ads' },
  {label : 'My Garage', route: 'my-garage'},
  // { label: 'Orders', route: 'orders' },
  { label: 'Payment Information', route: 'payment-info' },
  // { label: 'Addresses', route: 'addresses' },
  // { label: 'My Garage', route: 'garage' },
  { label: 'Wishlist', route: 'wishlist' },
  { label: 'Draft Posting Add', route: 'draft' }
];

  activeTab: string = 'Home';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
