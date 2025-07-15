import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';


interface Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  type: 'motorcycle' | 'part' | 'plate';
}
@Component({
  selector: 'app-recently-added-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recently-added-products.component.html',
  styleUrl: './recently-added-products.component.css'
})
export class RecentlyAddedProductsComponent {
    currentSlide = 0;
  slidesToShow = 5;
  recentProducts: Product[] = [
    {
      id: 1,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 2,
      title: 'Honda Shadow - Aero 2006',
      price: 55000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 3,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondashadow.png',
      type: 'motorcycle'
    },
    {
      id: 4,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 5,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 6,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondashadow.png',
      type: 'motorcycle'
    },
    {
      id: 7,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 8,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 9,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 10,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    },
    {
      id: 11,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur2.png',
      type: 'motorcycle'
    },
    {
      id: 12,
      title: 'Honda Shadow - Aero 2006',
      price: 54000,
      currency: 'SAR',
      imageUrl: '/pictures/hondablur1.png',
      type: 'motorcycle'
    }
    // , {
    //   id: 13,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur2.png',
    //   type: 'motorcycle'
    // },
    // {
    //   id: 14,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur1.png',
    //   type: 'motorcycle'
    // }, {
    //   id: 15,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur2.png',
    //   type: 'motorcycle'
    // },
    // {
    //   id: 16,
    //   title: 'Honda Shadow - Aero 2006',
    //   price: 54000,
    //   currency: 'SAR',
    //   imageUrl: '/pictures/hondablur1.png',
    //   type: 'motorcycle'
    // }
  ];

  // Slider configuration
  // currentSlide: number = 0;
  // slidesToShow: number = 5;
  slidesToMove: number = 5;
  totalSlides: number = this.recentProducts.length;
  dotsArray: number[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  // Computed property for CSS transform
  get currentSlidePosition(): number {
    return (this.currentSlide * 100) / this.slidesToShow;
  }


  updateSlidesToShow(): void {
    if (window.innerWidth < 640) {
      this.slidesToShow = 1;
      this.slidesToMove = 1;
    } else if (window.innerWidth < 768) {
      this.slidesToShow = 2;
      this.slidesToMove = 2;
    } else if (window.innerWidth < 1024) {
      this.slidesToShow = 3;
      this.slidesToMove = 3;
    } else {
      this.slidesToShow = 5;
      this.slidesToMove = 5;
    }
  }
  updateDotsArray(): void {
    const dotsCount = Math.ceil((this.totalSlides - this.slidesToShow + 1) / this.slidesToMove);
    this.dotsArray = Array(dotsCount).fill(0).map((_, i) => i);
  }
  ngOnInit(): void {
    // this.updateSlidesToShow();
    // this.updateDotsArray();

    // // Handle resize event to make slider responsive
    // window.addEventListener('resize', () => {
    //   this.updateSlidesToShow();
    //   this.updateDotsArray();
    //   // Make sure current slide is valid after resizing
    //   if (this.currentSlide > this.totalSlides - this.slidesToShow) {
    //     this.currentSlide = Math.max(0, this.totalSlides - this.slidesToShow);
    //   }
    // });
    if (isPlatformBrowser(this.platformId)) {
      this.updateSlidesToShow();
      this.updateDotsArray();

      window.addEventListener('resize', () => {
        this.updateSlidesToShow();
        this.updateDotsArray();
        if (this.currentSlide > this.totalSlides - this.slidesToShow) {
          this.currentSlide = Math.max(0, this.totalSlides - this.slidesToShow);
        }
      });
  }
  }
  // updateSlidesToShow(): void {
  //   if (window.innerWidth < 640) {
  //     this.slidesToShow = 1;
  //     this.slidesToMove = 1;
  //   } else if (window.innerWidth < 768) {
  //     this.slidesToShow = 2;
  //     this.slidesToMove = 2;
  //   } else if (window.innerWidth < 1024) {
  //     this.slidesToShow = 3;
  //     this.slidesToMove = 3;
  //   } else {
  //     this.slidesToShow = 5;
  //     this.slidesToMove = 5;
  //   }
  // }

  // updateDotsArray(): void {
  //   const dotsCount = Math.ceil((this.totalSlides - this.slidesToShow + 1) / this.slidesToMove);
  //   this.dotsArray = Array(dotsCount).fill(0).map((_, i) => i);
  // }

  // nextSlide(): void {
  //   if (this.currentSlide < this.totalSlides - this.slidesToShow) {
  //     this.currentSlide += this.slidesToMove;
  //     // Don't exceed total slides
  //     if (this.currentSlide > this.totalSlides - this.slidesToShow) {
  //       this.currentSlide = this.totalSlides - this.slidesToShow;
  //     }
  //   }
  // }

  // prevSlide(): void {
  //   if (this.currentSlide > 0) {
  //     this.currentSlide -= this.slidesToMove;
  //     // Don't go below 0
  //     if (this.currentSlide < 0) {
  //       this.currentSlide = 0;
  //     }
  //   }
  // }

  // goToSlide(index: number): void {
  //   this.currentSlide = index * this.slidesToMove;
  //   // Ensure we don't exceed boundaries
  //   if (this.currentSlide > this.totalSlides - this.slidesToShow) {
  //     this.currentSlide = this.totalSlides - this.slidesToShow;
  //   }
  // }




  
  get currentDotIndex() {
    return Math.floor(this.currentSlide / this.slidesToShow);
  }
  
  // get totalSlides() {
  //   return this.recentProducts.length;
  // }
  
  // get dotsArray() {
  //   return Array(Math.ceil(this.totalSlides / this.slidesToShow)).fill(0);
  // }
  
  getVisibleProducts() {
    return this.recentProducts.slice(this.currentSlide, this.currentSlide + this.slidesToShow);
  }
  
  nextSlide() {
    if (this.currentSlide < this.totalSlides - this.slidesToShow) {
      this.currentSlide += this.slidesToShow;
    }
  }
  
  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide -= this.slidesToShow;
    }
  }
  
  goToSlide(index: number) {
    this.currentSlide = index * this.slidesToShow;
  }
}
