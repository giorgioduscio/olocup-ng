import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavbarNavigazioneComponent } from './shared/navbar-navigazione/navbar-navigazione.component';
import { RoutesBreadcrumbComponent } from './shared/routes-breadcrumb/routes-breadcrumb.component';
import { BackToTopComponent } from './shared/back-to-top/back-to-top.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    HeaderComponent, NavbarNavigazioneComponent, RoutesBreadcrumbComponent,
    BackToTopComponent, FooterComponent, 
  ],

  // struttura principale dell'app
  template: `
  <app-header></app-header>
  <app-navbar-navigazione></app-navbar-navigazione>
  <app-routes-breadcrumb></app-routes-breadcrumb>

  <router-outlet></router-outlet>

  <app-back-to-top></app-back-to-top>
  <app-footer></app-footer>  `
})
export class AppComponent {
  title = 'Olocup';
}
