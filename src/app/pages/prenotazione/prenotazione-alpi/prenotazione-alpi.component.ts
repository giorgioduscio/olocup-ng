import { Component } from '@angular/core';
import { ModalComponent } from "../../../shared/modal/modal.component";
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AppPrestazioniService } from './app-prestazioni.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrenotazioneAlpiService } from './prenotazione-alpi.service';
import { AppConfermaService } from './app-conferma.service';
import { AppCalendarioService } from './app-calendario.service';
import { AppPazienteService } from './app-paziente.service';

@Component({
  selector: 'app-prenotazione-alpi',
  standalone: true,
  imports: [ModalComponent, NgFor, NgIf, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './prenotazione-alpi.component.html',
  styleUrl: './prenotazione-alpi.component.sass'
})
export class PrenotazioneAlpiComponent {


  constructor(
    public main:PrenotazioneAlpiService,
    public AppPrestazioni:AppPrestazioniService,
    public appConferma:AppConfermaService,
    public AppCalendario:AppCalendarioService,
    public AppPaziente:AppPazienteService
  ){}

  // tabs
  tabsDatas =[
    {key:'prestazione', title:'Prestazione',icon:'it-note',     status:()=>'active'},
    {key:'datetime',    title:'Data e Ora', icon:'it-calendar', 
      status:()=> this.AppPrestazioni.selezionate().length ?'' :'active'},
    {key:'paziente',    title:'Paziente',   icon:'it-user',     
      status:()=> this.AppPrestazioni.selezionate().length && this.AppCalendario.slotSelezionato() ?'' :'disabled'},
    {key:'confirm',     title:'Conferma',   icon:'it-check',    
      status:()=> this.AppPrestazioni.selezionate().length && 
                  this.AppCalendario.slotSelezionato() &&
                  this.AppPaziente.pazienteSelezionato()?'' :'disabled'},
  ]
  tabsHandleClick(e:Event){
    const tab = e.target as HTMLButtonElement    
    tab.scrollIntoView({ behavior:'smooth', block:'start' }) 
  }
  routeToTab(tabKey:'prestazione'|'datetime'|'paziente'|'confirm'){
    const tabEl = document.getElementById(tabKey+'-tab')
    if(!tabEl) return;
    setTimeout(()=> tabEl.click(), 200);
  }

  selezionaPrimaDisponibile(){
    setTimeout(() => {
      this.AppCalendario.selezionaPrimaDisponibile()
    }, 200);
  }
}
