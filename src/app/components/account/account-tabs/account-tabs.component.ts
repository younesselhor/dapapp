import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileCardComponent } from '../home-tab/profile-card/profile-card.component';

@Component({
  selector: 'app-account-tabs',
  imports: [CommonModule, ProfileCardComponent],
  standalone:true,
  templateUrl: './account-tabs.component.html',
  styleUrl: './account-tabs.component.css'
})
export class AccountTabsComponent {
  tabs: string[] = ['Home', 'Settings', 'Orders', 'Payment Information', 'Addresses', 'My Garage', 'Wishlist'];
  activeTab: string = 'Home';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
