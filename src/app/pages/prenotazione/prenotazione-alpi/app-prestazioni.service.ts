import { Injectable, Signal, WritableSignal, effect, inject, signal } from '@angular/core';
import { Prestazione } from '../../../interfaces/prestazione';
import { Struttura } from '../../../interfaces/struttura';
import { Medico } from '../../../interfaces/medico';
import { PrenotazioneAlpiService } from './prenotazione-alpi.service';

@Injectable({ providedIn: 'root' })
export class AppPrestazioniService {
  constructor(private main:PrenotazioneAlpiService) {
    // Effetto reattivo che aggiorna i dati da API e filtra le prestazioni
    effect(() => {
      this.prestazioni =this.main.prestazioni();
      this.strutture = this.main.strutture();
      this.medici = this.main.medici();

      // if(this.prestazioni.length && this.strutture.length && this.medici.length)  console.log(this.prestazioni.length , this.strutture.length , this.medici.length);
    });
  }

  // ───────────────────────────────────────────────
  // RENDER GENERALE
  // ───────────────────────────────────────────────
    prestazioni: Prestazione[] = [];
    strutture: Struttura[] = [];
    medici: Medico[] = [];

    renderPrestazioni(): Prestazione[] {
      let filtered = this.prestazioni;

      // Filtro per agenda se c’è almeno una selezionata
      if (this.selezionate().length) {
        const agendaId = this.selezionate()[0].agendaId;
        filtered = filtered.filter(p => p.agendaId === agendaId);
      }

      // Filtri
      const filtroPrestazioni = this.filtroPrestazioni().toLowerCase().trim();
      const struttura = this.filtroStruttura();
      const medico = this.filtroMedico();

      if (medico) filtered = filtered.filter(p => p.medicoId === +medico);
      if (struttura) filtered = filtered.filter(p => p.strutturaId === +struttura);
      if (filtroPrestazioni.length > 2) filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filtroPrestazioni) ||
        p.code.toLowerCase().includes(filtroPrestazioni)
      );
      
      // Ordina alfabeticamente
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    getStruttura =(id: number)=> this.strutture.find(s => Number(s.id) === id);
    getReparto =(id: number)=> this.main.reparti().find(r => Number(r.id) === id);
    getMedico =(id: number)=> this.medici.find(m => Number(m.id) === id);
    getAgenda =(id: number) => this.main.agende().find(a => Number(a.id) ==id);
    
  //! FILTRAGGIO
    filtroPrestazioni: WritableSignal<string> = signal('');
    filtroStruttura: WritableSignal<string> = signal('');
    filtroMedico: WritableSignal<string> = signal('');

    setFiltro(e: Event) {
      const {value, id} = (e.target as HTMLInputElement)
      
      switch(id){
        // case 'filtroPrestazioni': this.filtroPrestazioni.set(value.toLowerCase()); break;
        // case 'filtroStruttura': this.filtroStruttura.set(value); break;
        // case 'filtroMedico': this.filtroMedico.set(value); break;
      }
    }

    // Per messaggi condizionali
    hasActiveFilters(): boolean {
      return !!(this.filtroPrestazioni() || this.filtroStruttura() || this.filtroMedico());
    }

    isFiltroTestualeTroppoCorto(): boolean {
      const filtroPrestazioni = this.filtroPrestazioni().toLowerCase().trim();
      return filtroPrestazioni.length > 0 && filtroPrestazioni.length <= 2;
    }

    resetFiltri() {
      this.filtroPrestazioni.set('');
      this.filtroStruttura.set('');
      this.filtroMedico.set('');
      this.resetSelezione();
    }

  // ───────────────────────────────────────────────
  // SELEZIONE MULTIPLA
  // ───────────────────────────────────────────────
    // Signal che contiene tutte le prestazioni selezionate 
    selezionate: WritableSignal<Prestazione[]> = signal([]);
    // Controlla se una prestazione specifica viene selezionata
    isSelected =(p: Prestazione)=> this.getPrestazioniSelezionate()().some(sel => sel.id === p.id);

    // Aggiunge o rimuove una prestazione dalla selezione multipla.
    // Se già selezionata, la deseleziona. Altrimenti, la aggiunge.
    selezionaPrestazioni(p: Prestazione, e:Event) {
      const btnCalendario = (e.target as HTMLButtonElement).closest('[calendario]');
      const btnPaziente = (e.target as HTMLButtonElement).closest('[paziente]');
      if(this.isSelected(p) && (btnCalendario || btnPaziente)) return;

      // se l'elemento non era gia selezionato o se non si sono selezionati i pulsanti
      const attuali = this.selezionate();
      if (attuali.find(sel => sel.id === p.id)) 
          this.selezionate.set(attuali.filter(sel => sel.id !== p.id));
      else this.selezionate.set([...attuali, p]);

      // Disabilita pulsanti se cambiano le prestazioni selezionate
      document.getElementById('paziente-tab')?.classList.add('disabled');
      document.getElementById('confirm-tab')?.classList.add('disabled');
    }

    // Rimuove una prestazione specifica dalla selezione.
    deselezionaPrestazione(prestazioneId: number) {
      this.selezionate.set(
        this.selezionate().filter(p => Number(p.id) !=prestazioneId)
      );
    }

    //Svuota completamente la selezione.
    resetSelezione() {
      this.selezionate.set([]);
    }

    // Restituisce tutte le prestazioni attualmente selezionate.
    getPrestazioniSelezionate(): Signal<Prestazione[]> {
      return this.selezionate.asReadonly();
    }
}
