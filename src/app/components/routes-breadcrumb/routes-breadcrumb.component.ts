import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-routes-breadcrumb',
  standalone: true,
  imports: [RouterLink, NgIf],

  template: `
    <nav class="breadcrumb-container" aria-label="Percorso di navigazione">
      <div class="container">
        <ol class="breadcrumb">

          <li class="breadcrumb-item">
            <a routerLink="/home">Home</a>
            <span class="separator">/</span>
          </li>
          <li class="breadcrumb-item">
            <a routerLink="/settings">Settings</a>
            <span class="separator" *ngIf="match">/</span>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            @if(match){
              <a routerLink="/{{match}}">{{ formattedPath }}</a>

            }@else {
              <span>...</span>
            }
          </li>

        </ol>
      </div>
    </nav>
  `,
})
export class RoutesBreadcrumbComponent {
  // Rimuove il primo carattere "/"
  currentPath = (window.location.pathname).substring(1)
  // verifica l'esistenza della pagina
  match = routes.find(r => r.path === this.currentPath)?.path || ''
  // Formatta il percorso corrente
  formattedPath = (this.currentPath)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/-/g, ' ');

}
