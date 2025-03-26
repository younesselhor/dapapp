import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter-signup',
  imports: [],
  templateUrl: './newsletter-signup.component.html',
  styleUrl: './newsletter-signup.component.css'
})
export class NewsletterSignupComponent {
  email: string = '';

  subscribe() {
    console.log('Subscribed with:', this.email);
  }
}
