import { Injectable, Signal, WritableSignal, effect, signal } from '@angular/core';
import { Prestazione } from '../../../interfaces/prestazione';
import { PrestazioniService } from '../../../api/prestazioni.service';
import { StrutturaService } from '../../../api/struttura.service';
import { Struttura } from '../../../interfaces/struttura';
import { MediciService } from '../../../api/medici.service';
import { Medico } from '../../../interfaces/medico';

@Injectable({ providedIn: 'root' })
export class AppPrestazioniService {

  constructor(private prestazioniService: PrestazioniService, 
              private struttureService:StrutturaService,
              private mediciService:MediciService,
  ) {
    // Effetto reattivo che aggiorna i dati da API e filtra le prestazioni
    effect(() => {
      this.prestazioni = this.prestazioniService.prestazioni();
      this.strutture = this.struttureService.strutture();
      this.medici = this.mediciService.medici();
      // console.log('Prestazioni filtrate:', this.prestazioniFiltrate());
    });
  }

  // ───────────────────────────────────────────────
  // RENDER GENERALE
  // ───────────────────────────────────────────────
    prestazioni: Prestazione[] = [];
    strutture: Struttura[] = [];
    medici: Medico[] = [];

    prestazioniFiltrate(): Prestazione[] {
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

      if (filtroPrestazioni.length > 2) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(filtroPrestazioni) ||
          p.code.toLowerCase().includes(filtroPrestazioni)
        );
      }

      // Ordina alfabeticamente
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    getStruttura =(id: number)=> this.strutture.find(s => Number(s.id) === id);
    getReparto =(id: number)=> 0//this.reparti.find(r => r.id === id);
    getMedico =(id: number)=> 0//this.medici.find(m => Number(m.id) === id);
    getAgenda =(id: number) => 0//this.agende.find(a => a.id === id);
    firstDisponibilita =(prestazioni: Prestazione | Prestazione[])=> 0//AppCalendario.firstTime(prestazioni);
    


  // ───────────────────────────────────────────────
  // FILTRAGGIO
  // ───────────────────────────────────────────────
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
    }

  // ───────────────────────────────────────────────
  // SELEZIONE MULTIPLA
  // ───────────────────────────────────────────────
    // Signal che contiene tutte le prestazioni selezionate 
    selezionate: WritableSignal<Prestazione[]> = signal([]);
    isSelected =(p: Prestazione)=> this.getPrestazioniSelezionate()().some(sel => sel.id === p.id);

    // Aggiunge o rimuove una prestazione dalla selezione multipla.
    // Se già selezionata, la deseleziona. Altrimenti, la aggiunge.
    togglePrestazione(p: Prestazione) {
      const attuali = this.selezionate();
      if (attuali.find(sel => sel.id === p.id)) {
        this.selezionate.set(attuali.filter(sel => sel.id !== p.id));
      } else {
        this.selezionate.set([...attuali, p]);
      }
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
