import { Component } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [],
  styleUrl: './back-to-top.component.sass',
  
  template:`
  <a href="#" aria-label="Torna su" data-bs-toggle="backtotop" class="back-to-top" id="back-to-top">
    <svg class="icon icon-light">
      <use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-up"></use>
    </svg>
  </a>  `
})
export class BackToTopComponent {

}
