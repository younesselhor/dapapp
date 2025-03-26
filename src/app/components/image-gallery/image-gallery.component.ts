import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import{} from '../../../../public/assets/membership_benefits2.png';
@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent {
  images: string[] = [
    '/membership_benefits5.png',
    '/membership_benefits5.png',
    '/membership_benefits2.png'
  ];


  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']; // Dynamic sizes
  selectedSize: string | null = null; // Track selected size


  selectedImage: string = this.images[0];

  selectImage(image: string) {
    this.selectedImage = image;
  }

  quantity: number = 1;

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }
  selectSize(size: string) {
    this.selectedSize = size;
    console.log('Selected Size:', size); // You can send this value to your backend or use it as needed
  }
}
