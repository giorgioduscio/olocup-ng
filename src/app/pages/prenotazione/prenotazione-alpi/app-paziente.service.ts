import { Injectable,  effect } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PazientiService  } from '../../../api/pazienti.service';
import { StoricoPazienteService } from '../../../api/storico-paziente.service';



@Injectable({providedIn: 'root'})
export class AppPazienteService {

  pazienti: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  storicoPazienti: any[] = [];
  pazienteSelezionato: any = null;

  constructor(
    private PazientiService: PazientiService,
    private StoricoPazienteService: StoricoPazienteService) {}

    init(): void {
      try {
        this.PazientiService.get();
        
        effect(() => {
          const pazienti = this.PazientiService.pazienti();
          this.pazienti.next(pazienti); 
        });

        const storicoPazienti = this.StoricoPazienteService.get();
        if (Array.isArray(storicoPazienti)) {
          this.storicoPazienti = storicoPazienti;
        }
      } catch (error) {
        console.error('Errore nel caricamento pazienti', error);
      }
    }

    //  async init(): Promise<void> {
    //   try {
    //     const pazienti = await this.PazientiService.get();
    //     this.pazienti.next(pazienti); 

    //     const storicoPazienti = await this.StoricoPazienteService.get();
    //     this.storicoPazienti = storicoPazienti;

    //   } catch (error) {
    //     console.error('Errore nel caricamento pazienti', error);
    //   }
    // }
    
  // this.PazientiService.get().subscribe(pazienti => {
  //   this.pazienti.next(pazienti);
  // });
    
  // this.StoricoPazienteService.get().subscribe(storicoPaziente => {
  //     this.storicoPazienti = storicoPaziente;
  //   });
  // }

   setPazienteSelezionato(paziente: any): void {
    this.pazienteSelezionato = paziente;
  }

   getPazienteSelezionato(): any {
    return this.pazienteSelezionato;
  }

   updateNotes(id: string, notes: string, exemptionCode: string): void {
    const paziente = this.pazienti.getValue().find(p => p.id === id);
    if (paziente) {
      paziente.notes = notes;
      paziente.exemptionCode = exemptionCode;
    }
  }

  getStoricoPaziente(id: string): any {
    return this.storicoPazienti.find(p => p.pazienteId === id);
  }

}

//  renderPatients 

// filteredPatients: any[] = [];
// filterText = '';
// pazienti: any[] = [];

// constructor(private pazientiService: PazientiService) {}

// ngOnInit(): void {
//   this.pazientiService.init();

//   this.pazientiService.pazienti$.subscribe(pazienti => {
//     this.pazienti = pazienti;
//     this.renderPatients();
//   });
// }

// renderPatients(): void {
//   const filter = this.filterText.toLowerCase();

//   if (filter.length <= 2) {
//     this.filteredPatients = [];
//     return;
//   }

//   this.filteredPatients = this.pazienti.filter(p =>
//     p.firstName.toLowerCase().includes(filter) ||
//     p.lastName.toLowerCase().includes(filter) ||
//     p.fiscalCode.toLowerCase().includes(filter) ||
//     p.phoneNumber.toLowerCase().includes(filter)
//   );

//   // Ordinamento alfabetico per cognome

//   this.filteredPatients.sort((a, b) => a.lastName.localeCompare(b.lastName));

//   // Porta in cima il paziente selezionato

//   const selected = this.pazientiService.getPazienteSelezionato();
//   if (selected) {
//     const index = this.filteredPatients.findIndex(p => p.id === selected.id);
//     if (index > -1) {
//       const [sel] = this.filteredPatients.splice(index, 1);
//       this.filteredPatients.unshift(sel);
//     }
//   }
// }

// selezionaPaziente

// onPazienteClick(paziente: any): void {
//   this.pazientiService.setPazienteSelezionato(paziente);
//   this.renderSelectedPatient();
//   // Mostra tab di conferma, abilita pulsanti ecc.
// }

//  Visualizzazione paziente selezionato

// renderSelectedPatient(): void {
//   const sp = this.pazientiService.getPazienteSelezionato();
//   if (!sp) return;

//   const birthDate = new Date(sp.birthDate);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }

//   this.selectedPatientTemplate = {
//     fullName: `${sp.firstName} ${sp.lastName}`,
//     cf: sp.fiscalCode,
//     age,
//     phone: sp.phoneNumber,
//     address: `${sp.address}, ${sp.postalCode} ${sp.city} (${sp.province})`
//   };
// }

// Storico visite

// renderStoricoVisite(): any[] {
//   const paziente = this.pazientiService.getPazienteSelezionato();
//   const storico = this.pazientiService.getStoricoPaziente(paziente.id);
//   return storico?.visits || [];
// }

// Template convertito

// <!-- Tab PAZIENTE -->
// <div class="panel tab-pane show active" id="paziente">
//   <div class="row justify-content-center ">

//     <!-- Riepilogo Prenotazione (sinistra) -->
//     <aside class="col-12 col-md-4 col-lg-3 shadow mb-4 m-0">
//       <h5 class="font-weight-bold">Riepilogo Prenotazione</h5>

//       <div>
//         <div id="selectedPrestazioneC" class="selected-prestazione mb-4" [innerHTML]="selectedPrestazioneHtml"></div>
//         <hr />
//         <div id="TselectedPatient" class="details" *ngIf="selectedPatientTemplate">
//           <h6>{{ selectedPatientTemplate.fullName }}</h6>
//           <p class="small mb-1">CF: {{ selectedPatientTemplate.cf }}</p>
//           <p class="small mb-1">Nato il: {{ selectedPatientTemplate.age }} anni</p>
//           <p class="small mb-1">Tel: {{ selectedPatientTemplate.phone }}</p>
//           <p class="small mb-0">{{ selectedPatientTemplate.address }}</p>
//         </div>
//       </div>

//       <button class="btn btn-primary btn-block mt-3 w-100" (click)="goBack()">
//         <svg class="icon icon-sm icon-padded icon-white mr-2">
//           <use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-left-circle"></use>
//         </svg>Indietro
//       </button>
//     </aside>

//     <!-- Ricerca Paziente (centro) -->
//     <div class="col-12 col-md-8 col-lg-6 shadow-sm p-2 mb-4">
//       <div class="d-flex flex-column flex-md-row align-items-start justify-content-between px-3">
//         <h5 class="font-weight-bold">Ricerca Paziente</h5>
//         <div class="mt-2 mt-md-0 ms-md-2">
//           <button class="btn btn-primary btn-xs" type="button" data-bs-toggle="modal" data-bs-target="#addPatient">
//             <svg class="icon icon-sm icon-padded icon-white mr-1">
//               <use href="../../../bootstrap-italia/svg/sprites.svg#it-plus"></use>
//             </svg>Nuovo Paziente
//           </button>
//         </div>
//       </div>

//       <aside>
//         <div class="d-flex align-items-center mb-3">
//           <div class="it-search-wrapper w-100" style="border-bottom: 1px solid;">
//             <label for="filtroPazienti" class="visually-hidden">Cerca paziente...</label>
//             <div class="input-group align-items-center">
//               <svg class="icon icon-sm">
//                 <use href="../../../bootstrap-italia/svg/sprites.svg#it-search"></use>
//               </svg>
//               <input
//                 id="patientsFilter"
//                 type="search"
//                 class="form-control m-0 border-0"
//                 placeholder="Cerca paziente per nome, codice fiscale o telefono..."
//                 [(ngModel)]="filterText"
//                 (input)="renderPatients()" />
//             </div>
//           </div>
//         </div>

//         <!-- Risultati -->
//         <section class="list-group mb-3" id="patientsList">

//           <div *ngIf="filteredPatients.length === 0 && filterText.length <= 2" class="alert alert-info rounded">
//             Digita almeno 3 caratteri per filtrare i pazienti.
//           </div>

//           <div class="list-group" *ngIf="filteredPatients.length > 0">
//             <div
//               *ngFor="let paziente of filteredPatients"
//               class="agenda-item d-flex justify-content-between align-items-center p-3"
//               [ngClass]="{'pazienteSelezionato': paziente.id === pazientiService.getPazienteSelezionato()?.id}"
//               (click)="onPazienteClick(paziente)"
//             >
//               <div>
//                 <h6 class="mb-1">{{ paziente.lastName }} {{ paziente.firstName }}</h6>
//                 <p class="small text-muted mb-0">{{ paziente.fiscalCode }}</p>
//                 <p class="small text-muted mb-0">{{ paziente.birthDate | date:'dd/MM/yyyy' }} - {{ paziente.gender }}</p>
//                 <p class="small text-muted mb-0">Tel: {{ paziente.phoneNumber }}</p>
//                 <p class="small text-muted mb-0">{{ paziente.city }} ({{ paziente.recidenceProvince }})</p>
//               </div>
//               <div class="text-right btn-group-vertical">
//                 <button name="storicoPaziente" class="btn btn-sm btn-primary mt-1" data-bs-toggle="modal" data-bs-target="#historyModal" (click)="renderStoricoVisite(paziente)">
//                   <svg class="icon icon-sm icon-white">
//                     <use href="../../../bootstrap-italia/svg/sprites.svg#it-note"></use>
//                   </svg> <small>Storico</small>
//                 </button>
//                 <button class="btn btn-primary p-1 pe-3 text-nowrap" (click)="vaiAllaConferma()">
//                   <svg class="icon icon-sm icon-padded icon-white">
//                     <use href="../../../bootstrap-italia/svg/sprites.svg#it-arrow-right-circle"></use>
//                   </svg> <small>Conferma</small>
//                 </button>
//               </div>
//             </div>
//           </div>

//         </section>
//       </aside>
//     </div>

//   </div>
// </div>