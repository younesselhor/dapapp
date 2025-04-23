import { Component } from '@angular/core';
import { AccountTabsComponent } from '../account-tabs/account-tabs.component';

@Component({
  selector: 'app-account',
  imports: [AccountTabsComponent],
  standalone: true,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

}
