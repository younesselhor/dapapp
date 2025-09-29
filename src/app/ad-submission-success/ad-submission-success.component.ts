// // ad-submission-success.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-submission-success',
  templateUrl: './ad-submission-success.component.html',
  styleUrls: ['./ad-submission-success.component.css'],
  imports: [CommonModule]
})
export class AdSubmissionSuccessComponent implements OnInit {
  countdown = 5;
  private countdownInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    // Start countdown to automatically redirect to home
    this.startCountdown();
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/home']);
      }
    }, 1000);
  }

  navigateToHome() {
    clearInterval(this.countdownInterval);
    this.router.navigate(['/home']);
  }

  navigateToViewAd() {
    // clearInterval(this.countdownInterval);
    // // You might want to pass the ad ID here
    // this.router.navigate(['/view-ad']);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}