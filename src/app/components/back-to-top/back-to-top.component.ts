import { Component } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [],
  styleUrl: './back-to-top.component.sass',
  
  template:`
  <a href="#" aria-label="Torna su" data-bs-toggle="backtotop" class="back-to-top" (click)="scrollToTop()">
    <svg class="icon icon-light">
      <use href="assets/bootstrap-italia/svg/sprites.svg#it-arrow-up"></use>
    </svg>
  </a>  `
})
export class BackToTopComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
