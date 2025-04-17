import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-routes-breadcrumb',
  standalone: true,
  imports: [RouterLink, NgIf],
  styleUrl: './routes-breadcrumb.component.sass',
  templateUrl: `./routes-breadcrumb.component.html`,
})
export class RoutesBreadcrumbComponent {
  constructor(private router: Router) {
  }


  // Rimuove il primo carattere "/"
  currentPath = (window.location.pathname).substring(1)
  // verifica l'esistenza della pagina
  match = routes.find(r => r.path === this.currentPath)?.path || ''
  // Formatta il percorso corrente
  formattedPath = (this.currentPath)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/-/g, ' ');

  // Sottoscrizione per gli eventi di navigazione
  routerSubscription: any;
  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        // Aggiorna i valori quando l'URL cambia
        this.currentPath = window.location.pathname.substring(1);
        this.match = routes.find(r => r.path === this.currentPath)?.path || '';
        this.formattedPath = this.currentPath
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .replace(/-/g, ' ');

        // Ottieni e gestisci l'hash se presente
        const hash = window.location.hash;
        if (hash) {
          console.log('Hash cambiato:', hash);
          // Fai qualcosa con l'hash...
        }
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
}
