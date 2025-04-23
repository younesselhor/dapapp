import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-account-tabs',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './account-tabs.component.html',
  styleUrl: './account-tabs.component.css'
})
export class AccountTabsComponent {
  tabs = ['Home', 'Settings', 'Orders', 'Payment Information', 'Addresses', 'My Garage', 'Wishlist'];
  activeTab = 'Home';
}
