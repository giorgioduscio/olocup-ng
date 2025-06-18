import { Injectable, Signal, WritableSignal, effect, inject, signal } from '@angular/core';
import { Prestazione } from '../../../interfaces/prestazione';
import { Struttura } from '../../../interfaces/struttura';
import { Medico } from '../../../interfaces/medico';
import { PrenotazioneAlpiService } from './prenotazione-alpi.service';

@Injectable({ providedIn: 'root' })
export class AppPrestazioniService {
  constructor(private main:PrenotazioneAlpiService) {
    main.AppPrestazioni =this
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
  isSelected =(p:Prestazione)=> this.getPrestazioniSelezionate()().some(sel => sel.id === p.id)

  // Aggiunge o rimuove una prestazione dalla selezione multipla.
  selezionaPrestazioni(p: Prestazione, e: Event, routeToTab?: Function) {
    // Ottieni il pulsante cliccato: "Altre disponibilità" (calendario) o "Prima data disponibile" (paziente)
    const btnCalendario = (e.target as HTMLElement).closest('[calendario]');
    const btnPaziente = (e.target as HTMLElement).closest('[paziente]');

    // Ottieni le prestazioni attualmente selezionate
    const attuali = this.selezionate();
    // Verifica se la prestazione è già selezionata
    const selezionata = this.isSelected(p);

    // Se la prestazione è già selezionata e il click è su uno dei due pulsanti,
    // allora NON va deselezionata. Esegui solo le eventuali azioni di routing.
    if (selezionata && (btnCalendario || btnPaziente)) {
      setTimeout(() => {
        if (btnCalendario && routeToTab) routeToTab('datetime'); // Vai al calendario
        if (btnPaziente) this.main.AppCalendario.selezionaPrimaDisponibile(); // Seleziona primo slot disponibile
      }, 200);
      return; // Impedisce la deselezione dell'elemento
    }

    // Aggiungi o rimuovi la prestazione dalla selezione
    if (attuali.find(sel => sel.id === p.id)) {
      // Se la prestazione è già presente, rimuovila
      this.selezionate.set(attuali.filter(sel => sel.id !== p.id));
    } else {
      // Altrimenti aggiungila alla lista delle selezionate
      this.selezionate.set([...attuali, p]);
    }

    // Reset slot selezionato e paziente selezionato
    this.main.AppCalendario.slotSelezionato.set(null);
    this.main.AppPazienti.pazienteSelezionato.set(null);

    // Esegui eventuali azioni post-selezione
    // - Vai al calendario se è stato cliccato il pulsante relativo
    // - Seleziona automaticamente la prima disponibilità se richiesto
    setTimeout(() => {
      if (btnCalendario && routeToTab) routeToTab('datetime'); // Naviga alla tab calendario
      if (btnPaziente) this.main.AppCalendario.selezionaPrimaDisponibile(); // Seleziona primo slot disponibile
    }, 200);
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
