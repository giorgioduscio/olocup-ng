import { effect, Injectable, signal } from '@angular/core';
import { Medico } from '../../../interfaces/medico';
import { Struttura } from '../../../interfaces/struttura';
import { Reparto } from '../../../interfaces/reparto';
import { Agenda } from '../../../interfaces/agenda';
import { Prescrizione } from '../../../interfaces/prescrizione';
import { TipoStruttura } from '../../../interfaces/tipostruttura';
import { Prestazione } from '../../../interfaces/prestazione';
import { Slot } from '../../../interfaces/slot';
import { Paziente } from '../../../interfaces/paziente';
import { StoricoPaziente } from '../../../interfaces/storicopaziente';
import { MediciService } from '../../../api/medici.service';
import { StrutturaService } from '../../../api/struttura.service';
import { RepartiService } from '../../../api/reparto.service';
import { TipiStruttureService } from '../../../api/tipi-strutture.service';
import { AgendeService } from '../../../api/agende.service';
import { PrescriptionsService } from '../../../api/prescriptions.service';
import { PrestazioniService } from '../../../api/prestazioni.service';
import { SlotService } from '../../../api/slot.service';
import { PazientiService } from '../../../api/pazienti.service';
import { StoricoPazienteService } from '../../../api/storico-paziente.service';

@Injectable({  providedIn: 'root'})
export class PrenotazioneAlpiService {

  constructor(
    private meidiciService :MediciService,
    private struttureService :StrutturaService,
    private repartoService :RepartiService,
    private tipiStruttureService :TipiStruttureService,
    private agendeService :AgendeService,
    private prescrizioniService :PrescriptionsService,
    private prestazioniService :PrestazioniService,
    private slotsService :SlotService,
    private pazientiService :PazientiService,
    private storicoPazientiService :StoricoPazienteService,
  ) {
    effect(() => {
      this.medici.set(this.meidiciService.medici());
      this.strutture.set(this.struttureService.strutture());
      this.reparti.set(this.repartoService.reparti());
      this.tipiStrutture.set(this.tipiStruttureService.tipiStrutture());
      this.agende.set(this.agendeService.agende());
      this.prescrizioni.set(this.prescrizioniService.prescrizioni());
      this.prestazioni.set(this.prestazioniService.prestazioni());
      this.slots.set(this.slotsService.slots());
      this.pazienti.set(this.pazientiService.pazienti());
      this.storicoPazienti.set(this.storicoPazientiService.storicoPazienti());

      // if(this.medici().length && this.strutture().length && this.reparti().length && this.tipiStrutture().length && this.agende().length && this.prescrizioni().length && this.prestazioni().length && this.slots().length && this.pazienti().length && this.storicoPazienti().length)
      //   console.log('PrenotazioneAlpiService: dati caricati');
      
    },{ allowSignalWrites: true });
  }

  medici = signal<Medico[]>([]);
  strutture = signal<Struttura[]>([]);
  reparti = signal<Reparto[]>([]);
  tipiStrutture = signal<TipoStruttura[]>([]);
  agende = signal<Agenda[]>([]);
  prescrizioni = signal<Prescrizione[]>([]);
  prestazioni = signal<Prestazione[]>([]);
  slots = signal<Slot[]>([]);
  pazienti = signal<Paziente[]>([]);
  storicoPazienti = signal<StoricoPaziente[]>([]);
}
