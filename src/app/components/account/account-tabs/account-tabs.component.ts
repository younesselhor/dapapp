import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileCardComponent } from '../home-tab/profile-card/profile-card.component';
import { SavedVehiclesComponent } from '../home-tab/saved-vehicles/saved-vehicles.component';
import { SettingsComponent } from '../home-tab/settings/settings.component';
import { PaymentCardUserComponent } from '../home-tab/payment-card-user/payment-card-user.component';
import { SoomBoxComponent } from '../home-tab/soom-box/soom-box.component';
import { DraftProductComponent } from '../home-tab/draft-product/draft-product.component';

@Component({
  selector: 'app-account-tabs',
  imports: [CommonModule, ProfileCardComponent,SavedVehiclesComponent, SettingsComponent, PaymentCardUserComponent, SoomBoxComponent,DraftProductComponent],
  standalone:true,
  templateUrl: './account-tabs.component.html',
  styleUrl: './account-tabs.component.css'
})
export class AccountTabsComponent {
  tabs: string[] = ['Home', 'Settings','SOOM Box','My Ads' ,'Orders', 'Payment Information', 'Addresses', 'My Garage', 'Wishlist','Draft Posting Add'];
  activeTab: string = 'Home';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
