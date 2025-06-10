import { Injectable,  effect, signal } from '@angular/core';
import { Paziente } from '../../../interfaces/paziente';
import { StoricoPaziente } from '../../../interfaces/storicopaziente';
import { PrenotazioneAlpiService } from './prenotazione-alpi.service';

@Injectable({providedIn: 'root'})
export class AppPazienteService {
  constructor(private main:PrenotazioneAlpiService) {
    effect(() => {
      this.pazienti =this.main.pazienti();
      this.storicoPazienti = this.main.storicoPazienti();
    });
  }

  //* MOSTRA DATI
  pazienti :Paziente[] = [];
  storicoPazienti :StoricoPaziente[] =[];
  pazienteSelezionato =signal<Paziente|null>(null);
  filtroPaziente: string = '';
  renderPatients() {
    let filteredPatients =this.pazienti;

    // FILTRO
    const f =this.filtroPaziente.toLowerCase()
    if(f.length>2) filteredPatients = filteredPatients.filter(p =>
      p.firstName.toLowerCase().includes(this.filtroPaziente.toLowerCase()) ||
      p.lastName.toLowerCase().includes(this.filtroPaziente.toLowerCase()) ||
      p.fiscalCode.toLowerCase().includes(this.filtroPaziente.toLowerCase()) ||
      p.phoneNumber.toLowerCase().includes(this.filtroPaziente.toLowerCase())
    ); 
    else filteredPatients =[]
    
    // ORDINAMENTO ALFABETICO per nome
    filteredPatients.sort((a, b) => a.lastName.localeCompare(b.lastName));
    const isSel =(p:Paziente)=>this.pazienteSelezionato()?.id ==p.id ?'pazienteSelezionato' :'';

    // Se esiste un paziente selezionato, portalo in cima
    if (this.pazienteSelezionato()) {
      const index = filteredPatients.findIndex(s => s.id == this.pazienteSelezionato()?.id);
      if (index !== -1) {
        const [selected] = filteredPatients.splice(index, 1); // rimuovi
        filteredPatients.unshift(selected); // inserisci in testa
      }
    }    
    return {pazienti: filteredPatients, isSel}
  }
  calcoloEta(){
    const birthDate = new Date(this.pazienteSelezionato()?.birthDate ||'');
    const today = new Date();
    let ages = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    // compleanno ancora da fare? togli 1
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ages--;
    return ages
  }

  //* SELEZIONE DATI
  selezionaPaziente(e:Event, p:Paziente){
    this.pazienteSelezionato.set(p)

    const btn = (e.target as HTMLButtonElement).closest('[nextBtn]');
    if(btn) setTimeout(() => {
      document.getElementById('confirm-tab')?.click();
    }, 200);
  }
}