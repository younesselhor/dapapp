import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';
import { FormsModule } from '@angular/forms';
import { CommentComponent } from '../comment/comment.component';
import { NewsletterSignupComponent } from '../newsletter-signup/newsletter-signup.component';
interface Comment {
  user: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpfulCount: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,ImageGalleryComponent,FormsModule,CommentComponent,NewsletterSignupComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})

export class ProductDetailsComponent {
  activeTab: string = 'Product Details';

  ratingCategories = [
    { label: 'Bang For The Buck', score: 4.3 },
    { label: 'Protection & Durability', score: 4.1 },
    { label: 'Features', score: 3.9 },
    { label: 'Comfort', score: 4.0 },
    { label: 'Style', score: 4.4 }
  ];

  ratings = [
    { label: 'Bang For The Buck', value: 4.3 },
    { label: 'Protection & Durability', value: 4.1 },
    { label: 'Features', value: 3.9 },
    { label: 'Comfort', value: 4.0 },
    { label: 'Style', value: 4.4 },
    { label: 'Air Flow', value: 3.8 }
  ];

  fitValue = 3;
  starPercentages = {
    5: 40,
    4: 34,
    3: 13,
    2: 6,
    1: 7
  };

  getPercentage(rating: number): number {
    return this.starPercentages[rating as keyof typeof this.starPercentages];
  }
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  comments: Comment[] = [
    {
      user: 'Ahmed Mohamed',
      rating: 3,
      date: 'December 29, 2012',
      title: 'Inconsistent sizing',
      content: 'They come smaller in size now...',
      helpfulCount: 0,
    },
    {
      user: 'Ahmed Mohamed',
      rating: 3,
      date: 'December 29, 2012',
      title: 'Size UP - Did Not Fit',
      content: 'Ordered a size Medium, my normal usual size...',
      helpfulCount: 0,
    },
  ];
}
