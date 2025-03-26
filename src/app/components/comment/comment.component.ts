import { Component, Input } from '@angular/core';


interface Review {
  author: string;
  isVerified: boolean;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
}
@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment!: Review;

  @Input() name: string = '';
  @Input() title: string = '';
  @Input() rating: number = 0;
  @Input() date: string = '';
  @Input() content: string = '';
  @Input() helpfulCount: number = 0;
  @Input() unhelpfulCount: number = 0;


  review: Review = {
    author: 'Ahmed Mohamed',
    isVerified: true,
    rating: 2,
    title: 'Size UP - Did Not Fit',
    content: 'Ordered a size Medium, my normal usual size, based on the Size Chart hand measurements. Once received, I could not get my hands through the cuff openings, no matter how hard I tried. Gloves were promptly returned. Comparing to my other gloves, the BILT Sprint glove fingers are shorter too. Size UP - don\'t trust the attached Size Chart.',
    date: 'December 29, 2012',
    helpfulVotes: 0,
    unhelpfulVotes: 0
  };
}
