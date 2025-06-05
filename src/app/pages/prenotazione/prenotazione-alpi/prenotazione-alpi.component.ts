import { Component } from '@angular/core';
import { ModalComponent } from "../../../shared/modal/modal.component";
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-prenotazione-alpi',
  standalone: true,
  imports: [ModalComponent, NgFor, NgIf],
  templateUrl: './prenotazione-alpi.component.html',
  styleUrl: './prenotazione-alpi.component.sass'
})
export class PrenotazioneAlpiComponent {
  tabsDatas =[
    {key:'prestazione', title:'Prestazione',icon:'it-note',     status:'active'},
    {key:'datetime',    title:'Data e Ora', icon:'it-calendar', status:'disabled'},
    {key:'paziente',    title:'Paziente',   icon:'it-user',     status:'disabled'},
    {key:'confirm',     title:'Conferma',   icon:'it-check',    status:'disabled'},
  ]
}
