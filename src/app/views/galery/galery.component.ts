import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
//import Glide from '@glidejs/glide/dist/glide.modular.esm';

import { CONSTANTS } from '../../shared/constants';
import { Images } from 'src/app/shared/interfaces/image.interface';



@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.css']
})
export class GaleryComponent {

  @ViewChild('carousel') carousel: ElementRef | null = null;
  currentIndex: number = 0;
  images:Images[] = CONSTANTS.images;

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    const translateX = -this.currentIndex * 100; // 100% de ancho por imagen
    if (this.carousel) {
      this.carousel.nativeElement.style.transform = `translateX(${translateX}%)`;      
    }
  }
}
