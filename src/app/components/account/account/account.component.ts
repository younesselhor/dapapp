import { Component } from '@angular/core';
import { AccountTabsComponent } from '../account-tabs/account-tabs.component';

interface User {
  name: string;
  email: string;
  profileImage?: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
}
@Component({
  selector: 'app-account',
  imports: [AccountTabsComponent],
  standalone: true,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {





  user: User = {
    name: 'Ashraf Aboulsoud',
    email: 'Ashraf@gmail.com',
    stats: {
      posts: 10,
      followers: 27,
      following: 12,
      likes: 150
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
