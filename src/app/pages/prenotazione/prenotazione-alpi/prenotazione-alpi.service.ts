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
import { InvoicesService } from '../../../api/invoices.service';
import { Invoice } from '../../../interfaces/invoice';

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
    private invoiceService:InvoicesService,
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
      this.invoices.set(this.invoiceService.invoices());

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
  invoices = signal<Invoice[]>([]);

  getStruttura =(id: number)=> this.strutture().find(s => Number(s.id) === id);
  getReparto =(id: number)=> this.reparti().find(r => Number(r.id) === id);
  getMedico =(id: number)=> this.medici().find(m => Number(m.id) === id);
  getAgenda =(id: number) => this.agende().find(a => Number(a.id) ==id);
}
