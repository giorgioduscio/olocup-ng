import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-navigazione',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './navbar-navigazione.component.html',
  styleUrl: './navbar-navigazione.component.sass'
})
export class NavbarNavigazioneComponent {
  constructor(){
    // console.log(this.sezioni);
  }
  
  sezioni=[
    { title: 'Ticket',          link: '/ticket' },
    { title: 'Pazienti',        link: '/pazienti' },
    { title: 'Prenotazioni',    link: '/prenotazione' },
    { title: 'Agende',          link: '/agende' },
    { title: 'Flussi',          link: '/flussi' },
    { title: 'Ricerca',         link: '/ricerca' },
    { title: 'Accettazioni',    link: '/accettazione' },
    { title: 'Report',          link: '/report' },
    { title: 'Tabelle',         link: '/tabelle' },
    { title: 'Utenti',          link: '/utenti' },
    { title: 'Unità Operative', link: '/unita_operative' }
  ]

  reparti=[
    { title: 'Radiologia',  link: '/radiologia' },
    { title: 'Cardiologia', link: '/cardiologia' },
    { title: 'Neurologia',  link: '/neurologia' },
    { title: 'Ortopedia',   link: '/ortopedia' },
    { title: 'Oftalmologia',link: '/oftalmologia' },
  ]
}
