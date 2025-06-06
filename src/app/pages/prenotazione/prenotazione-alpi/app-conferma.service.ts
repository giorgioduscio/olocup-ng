import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class AppConfermaService {

   newPrenotation = {
    prestazioneId: null as number | null,
    status: "to_book",
    pazienteId: null as number | null,
    date: null as string | null,
    time: null as string | null,
    medicoId: null as number | null,
    strutturaId: null as number | null,
    payId: null as number | null,
    prescriptionId: null as number | null,
  };

  resetPrenotation() {
    this.newPrenotation = {
      prestazioneId: null,
      status: "to_book",
      pazienteId: null,
      date: null,
      time: null,
      medicoId: null,
      strutturaId: null,
      payId: null,
      prescriptionId: null,
    };
  }

  renderAppointment(
    appointmentDetailsElement: HTMLElement,
    data: {
      paziente: any,
      prestazioni: any[],
      medici: any[],
      strutture: any[],
      reparti: any[],
      appointments: any[],
      invoices: any[],
      prescriptions: any[],
      slot: { date: string; time: string; }
    }
  ) {
    if (!appointmentDetailsElement) return;

    const {
      paziente,
      prestazioni,
      medici,
      strutture,
      reparti,
      appointments,
      invoices,
      prescriptions,
      slot
    } = data;

    if (!prestazioni || prestazioni.length === 0) {
      appointmentDetailsElement.innerHTML = `<div class="alert alert-warning rounded">
        Visualizzazione non disponibile. Selezionare prima Prestazione, data, orario e paziente
      </div>`;
      return false;
    }

    const maxPreparationTime = Math.max(...prestazioni.map(p => p.preparationTime || 0));
    const totalDuration = prestazioni.reduce((sum, p) => sum + (p.defaultDuration || 0), 0);
    const totalPrivatePrice = prestazioni.reduce((sum, p) => sum + (p.privatePrice || 0), 0);

    const firstPrestazione = prestazioni[0];
    const medico = medici.find(d => d.id == firstPrestazione.medicoId) || {};
    const struttura = strutture.find(f => f.id == firstPrestazione.strutturaId) || {};
    const reparto = reparti.find(d => d.id == firstPrestazione.repartoId) || {};
    const appointment = appointments.find(a => a.id == firstPrestazione.appointmentId) || {};
    const invoice = invoices.find(i => i.id == paziente?.id) || {};
    const prescription = prescriptions.find(p => p.id == firstPrestazione.prescriptionNumberId) || {};

    if (paziente && medico && struttura && reparto && appointment && prescription && slot) {
      this.newPrenotation.prestazioneId = Number(firstPrestazione?.id);
      this.newPrenotation.pazienteId = Number(paziente?.id);
      this.newPrenotation.medicoId = Number(medico?.id);
      this.newPrenotation.strutturaId = Number(struttura?.id);
      this.newPrenotation.payId = Number(invoice?.id);
      this.newPrenotation.prescriptionId = Number(prescription?.id);
      this.newPrenotation.date = slot.date;
      this.newPrenotation.time = slot.time;

      appointmentDetailsElement.innerHTML = `
      <h5 class="card-header text-bg-primary mb-3"> Dettagli Appuntamento </h5>
      <main class="row">
        <div class="col-md-6">
          <h6 class="font-weight-bold mt-3">
            <svg class="icon icon-sm icon-padded icon-primary mr-1">
              <use href="../../../bootstrap-italia/svg/sprites.svg#it-file"></use>
            </svg>Prestazioni
          </h6>
          <ul class="d-flex gap-2 flex-wrap justify-content-between list-unstyled ">
            ${prestazioni.map(prestazione => `
              <li>
                <div class="small p-2">
                  <svg class="icon icon-sm"><use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-right-triangle"></use></svg>
                    ${prestazione.name}
                <div class="small text-muted p-2 text-center">Codice: ${prestazione.code}</div>
              </li>
            `).join('')}
          </ul>
          <footer class="pb-2">
            <div class="small text-muted">Codice prescrizione: <b>${prescription.prescriptionNumber}</b></div>
            <div class="small text-muted">Tempo preparazione: <b>${maxPreparationTime} minuti</b></div>
            <div class="small text-muted">Durata visita: <b>${totalDuration} minuti</b></div>
          </footer>
        </div>

        <div class="col-md-6">
          <h6 class="font-weight-bold mt-3">
            <svg class="icon icon-sm icon-padded icon-primary mr-1">
              <use href="../../../bootstrap-italia/svg/sprites.svg#it-pa"></use>
            </svg>Struttura
          </h6>
          <div>${struttura.name}</div>
          <div class="small text-muted">Reparto:  <b>${reparto.name} ${reparto.branchTypeId}, Piano ${reparto.branchCode}</b></div>
          <div class="small text-muted">Struttura:  <b>${struttura.address}, ${struttura.city}, (${struttura.province})</b></div>
          <div class="small text-muted">Email:  <b>${struttura.email}</b></div>
          <div class="small text-muted">Telefono: <b>${struttura.phone}</b></div>
        </div>

        <div class="col-md-6">
          <h6 class="font-weight-bold mt-3">
            <svg class="icon icon-sm icon-padded icon-primary mr-1">
              <use href="../../../bootstrap-italia/svg/sprites.svg#it-calendar"></use>
            </svg>Data e Ora
          </h6>
          <p class="small text-muted">${this.itaDate(slot.date)},  ${slot.time}</p>
        </div>          

        <div class="col-md-6">
          <h6 class="font-weight-bold mt-3">
            <svg class="icon icon-sm icon-padded icon-primary mr-1">
              <use href="../../../bootstrap-italia/svg/sprites.svg#it-user"></use>
            </svg>Paziente
          </h6>
          <div>${paziente.lastName} ${paziente.firstName}</div>
          <div class="small text-muted">CF: ${paziente.fiscalCode}</div>
          <div class="small text-muted">Nato il: ${ this.itaDate(paziente.birthDate)}</div>
          <div class="small text-muted">Genere: ${paziente.gender}</div>
        </div>

        <div class="col-md-6">
          <h6 class="font-weight-bold mt-3">
            <svg class="icon icon-sm icon-padded icon-primary mr-1">
              <use href="../../../bootstrap-italia/svg/sprites.svg#it-user"></use>
            </svg>Medico
          </h6>
          <div>${medico.title} ${medico.lastName} ${medico.firstName}</div>
          <div class="small text-muted"> Email: ${medico.email}</div>
          <div class="small text-muted">Telefono: ${medico.phone}</div>
        </div>
        
        <div class="col-md-6">  
          <h6 class="font-weight-bold mt-3">
            <svg class="icon icon-sm icon-padded icon-primary mr-1">
              <use href="../../../bootstrap-italia/svg/sprites.svg#it-card"></use>
            </svg>Pagamento
          </h6>
          <p>Costo totale prestazioni: ${totalPrivatePrice.toFixed(2)}€</p>
          ${invoice.paymentMethod ? `<p class="small text-muted">Modalità: ${invoice.paymentMethod} </p>` : ''}
          ${paziente.exemptionCode ? `<p class="small text-muted">Esenzione: ${paziente.exemptionCode}</p>` : ''}
          ${totalPrivatePrice > 77.47 ? `
            <div class="alert alert-primary  rounded mt-3">
              Attenzione: per importi superiori a 77,47€ deve essere applicata l’imposta di bollo da 2€.
            </div>
          ` : ''}
          </div>
        </main>
      </div>`;
      return true;
    } else {
      appointmentDetailsElement.innerHTML = `<div class="alert alert-warning rounded">
        Visualizzazione non disponibile. Selezionare prima Prestazione, data, orario e paziente
      </div>`;
      return false;
    }
  }

  itaDate(dateStr: string): string {
    // Conversione semplice data in formato italiano gg/mm/yyyy
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT');
  }

}
 

// // confirm.component.ts
// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ConfirmService } from './confirm.service';

// @Component({
//   selector: 'app-confirm',
//   templateUrl: './confirm.component.html',
//   styleUrls: ['./confirm.component.css']
// })
// export class ConfirmComponent implements OnInit {
  
//   @ViewChild('appointmentDetails') appointmentDetailsRef!: ElementRef;

//   // Simula dati che probabilmente arrivano da altri componenti o service
//   paziente: any = null;
//   prestazioni: any[] = [];
//   medici: any[] = [];
//   strutture: any[] = [];
//   reparti: any[] = [];
//   appointments: any[] = [];
//   invoices: any[] = [];
//   prescriptions: any[] = [];
//   slot: any = null;

//   sendSMS = false;
//   sendEmail = false;
//   btnDisabled = true;

//   constructor(public confirmService: ConfirmService) {}

//   ngOnInit() {
//     // Qui normalmente caricheresti i dati necessari
//     this.loadData();

//     // Render primo aggiornamento
//     setTimeout(() => this.render(), 0);
//   }

//   loadData() {
//     // Esempio dummy dati, sostituisci con dati reali o input componenti
//   }

//   render() {
//     if(!this.appointmentDetailsRef) return;

//     const result = this.confirmService.renderAppointment(this.appointmentDetailsRef.nativeElement, {
//       paziente: this.paziente,
//       prestazioni: this.prestazioni,
//       medici: this.medici,
//       strutture: this.strutture,
//       reparti: this.reparti,
//       appointments: this.appointments,
//       invoices: this.invoices,
//       prescriptions: this.prescriptions,
//       slot: this.slot,
//     });

//     this.btnDisabled = !result;
//   }

//   onConfirm() {
//     console.warn('Invio prenotazione', this.confirmService.newPrenotation);
//     if(this.sendEmail) console.warn('Invio email');
//     if(this.sendSMS) console.warn('Invio sms');

//     // feedback visivo
//     const btn = document.getElementById('confermaPrenotazione');
//     if (!btn) return;
//     btn.classList.add('btn-success');
//     btn.classList.remove('btn-primary');
//     const useIcon = btn.querySelector('use');
//     useIcon?.classList.remove('d-none');

//     setTimeout(() => {
//       btn.classList.remove('btn-success');
//       btn.classList.add('btn-primary');
//       useIcon?.classList.add('d-none');
//     }, 2000);
//   }

// }

// html
// <!-- confirm.component.html -->
// <div class="panel tab-pane" id="confirm">
//   <div class="row justify-content-center">
//     <div class="col-lg-8 offset-lg-2 shadow p-3 mb-5 m-0">
//       <h5 class="font-weight-bold mb-4 text-center" aria-label="Riepilogo Prenotazione">Riepilogo Prenotazione</h5>
//       <div class="card">
//         <div class="card-body p-0">
//           <div #appointmentDetails id="appointmentDetails"></div>

//           <div>
//             <div class="form-check mt-3">
//               <input title="Promemoria via SMS" class="form-check-input" type="checkbox" id="sendSMSCheck" [(ngModel)]="sendSMS">
//               <label class="form-check-label" for="sendSMSCheck" aria-label="Invia promemoria SMS al paziente">Invia promemoria SMS al paziente</label>
//             </div>
//             <div class="form-check">
//               <input title="Promemoria via Email" class="form-check-input" type="checkbox" id="sendEmailCheck" [(ngModel)]="sendEmail">
//               <label class="form-check-label" for="sendEmailCheck" aria-label="Invia promemoria Email al paziente">Invia promemoria Email al paziente</label>
//             </div>                    
//           </div>
//         </div>
//       </div>
//       <div class="row justify-content-center">
//         <div class="col-12 col-md-6">
//           <div class="alert alert-info rounded" role="alert">
//             <h6 class="text-uppercase text-muted small d-flex align-items-center">Note</h6>
//             <p class="small" aria-label="Portare documentazione clinica precedente. Presentarsi 15 minuti prima dell'appuntamento per pratiche amministrative.">
//               Portare documentazione clinica precedente. Presentarsi 15 minuti prima dell'appuntamento per pratiche amministrative.</p>
//           </div>
//         </div>
//         <div class="col-12 col-md-6">
//           <h6 class="text-uppercase text-muted small d-flex align-items-center" aria-label="Documenti Richiesti">
//             <svg class="icon icon-sm icon-padded icon-primary me-1">
//               <use href="../../../bootstrap-italia/svg/sprites.svg#it-files"></use>
//             </svg>Documenti Richiesti
//           </h6>
//           <ul class="list list-unstyled small ps-3 ">
//             <li aria-label="Documento d'identità"><svg class="icon icon-sm me-2"><use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-right-triangle"></use></svg>Documento d'identità</li>
//             <li aria-label="Tessera sanitaria"><svg class="icon icon-sm me-2"><use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-right-triangle"></use></svg>Tessera sanitaria</li>
//             <li aria-label="Impegnativa medico curante"><svg class="icon icon-sm me-2"><use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-right-triangle"></use></svg>Impegnativa medico curante</li>
//             <li aria-label="Eventuali esami precedenti"><svg class="icon icon-sm me-2"><use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-right-triangle"></use></svg>Eventuali esami precedenti</li>
//           </ul>
//         </div>
//       </div>
//       <div class="d-flex justify-content-between align-items-center gap-3">
//         <button title="Indietro" class="btn btn-primary" data-target-tab="#paziente" aria-label="Indietro">
//           <svg class="icon icon-sm icon-padded icon-white mr-2">
//             <use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-left-circle"></use>
//           </svg>Indietro
//         </button>
//         <button title="Conferma Prenotazione" class="btn btn-primary" id="confermaPrenotazione" aria-label="Conferma Prenotazone" (click)="onConfirm()" [disabled]="btnDisabled">
//           <svg class="icon icon-sm icon-padded icon-white mr-2">
//             <use href="../../../bootstrap-italia/svg/sprites.svg#it-check" class="d-none"></use>
//           </svg>Conferma Prenotazione
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

// Note importanti:
// Dovrai fornire i dati reali (paziente, prestazioni, medici, ecc) al componente tramite @Input() o servizi centrali.

// La funzione renderAppointment() restituisce true se il contenuto è renderizzato e quindi abilita il pulsante conferma.

// Per semplificare, il rendering HTML diretto è mantenuto (anche se in Angular è preferibile fare template binding).

// Puoi migliorare il codice spostando il rendering in template Angular puro, ma qui ho voluto mantenere più fedele la logica originale.