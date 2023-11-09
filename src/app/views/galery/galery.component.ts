import { Component, ElementRef, ViewChild, QueryList, AfterViewInit, ViewChildren } from '@angular/core';
import { cilArrowCircleLeft, cilArrowCircleRight } from '@coreui/icons';

import { CONSTANTS } from '../../shared/CONSTANTS';
import { Images } from 'src/app/shared/interfaces/image.interface';


@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.css'],
})
export class GaleryComponent implements AfterViewInit {
  
  icons = { cilArrowCircleLeft, cilArrowCircleRight };

  @ViewChild('carousel') carousel: ElementRef | null = null;
  @ViewChildren('img') imgElement: QueryList<ElementRef> | null = null;
  currentIndex: number = 0;
  images:Images[] = CONSTANTS.images;
  imagesWidth: number[] = [];

  ngAfterViewInit(): void {
    if (this.imgElement) {
      this.imgElement.forEach((imgElement: ElementRef, index: number) => {
        const width = imgElement.nativeElement.width
        this.imagesWidth.push(width)
      });      
    }
    
    
  }

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
    //const translateX = -this.imagesWidth[this.currentIndex]; 
    const translateX = (-this.currentIndex * this.imagesWidth[this.currentIndex]) / 100; 
    if (this.carousel) {
      this.carousel.nativeElement.style.transform = `translateX(${translateX}%)`;
    }
    
  }
}
