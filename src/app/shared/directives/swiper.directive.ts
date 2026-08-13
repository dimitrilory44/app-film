// swiper.directive.ts
import { Directive, ElementRef, AfterViewInit, OnDestroy, input } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

@Directive({
  selector: '[appSwiper]',
  standalone: true,
})
export class SwiperDirective implements AfterViewInit, OnDestroy {
  config = input<SwiperOptions>({});
  private swiper?: Swiper;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.swiper = new Swiper(this.el.nativeElement, {
      modules: [Navigation, Pagination],
      observer: true,      
      observeParents: true,
      ...this.config(),
    });
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }
}