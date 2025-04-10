import { Component, effect } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { NavbarNavigazioneComponent } from "../../components/navbar-navigazione/navbar-navigazione.component";
import { ModalComponent } from '../../components/modal/modal.component';
import { BackToTopComponent } from "../../components/back-to-top/back-to-top.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { UnitaOperativeService } from '../../api/unita-operative.service';
import { NgFor, NgIf } from '@angular/common';
import unitaOperativa from '../../interfaces/unita-operative';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoutesBreadcrumbComponent } from "../../components/routes-breadcrumb/routes-breadcrumb.component";
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-unita-operative',
  standalone: true,
  imports: [ModalComponent, HeaderComponent, NavbarNavigazioneComponent, BackToTopComponent, FooterComponent, PaginationComponent,
    NgFor, NgIf, FormsModule, ReactiveFormsModule, RoutesBreadcrumbComponent],
  templateUrl: './unita-operative.component.html',
  styleUrl: './unita-operative.component.sass'
})
export class UnitaOperativeComponent {
  constructor(public uos: UnitaOperativeService){
    // Effetto reattivo che si attiva quando cambiano i dati delle unità operative
    effect(() => {
      this.filteredUnits = this.uos.unitaOperative(); // tutti i dati
      if (this.filteredUnits.length === 0) return;
      this.changePagination();
    });
    // Costruzione del form dinamico
    const controls = this.formFields.reduce((acc, field) => {
      (acc as Record<string, FormControl>)[field.key] = new FormControl('', field.validators);
      return acc;
    }, {});

    this.form = new FormGroup(controls);
    
  }

  // FIX VISUALIZZAZIONE
  // TODO: tabella 
  unitaOperative: unitaOperativa[] = []
  
  // Configurazione dei campi della tabella (nome visualizzato e chiave)
  nomiCampi :{key: keyof unitaOperativa, title:string}[] =[
    { key:'id',                   title:"Id" },
    { key:'codice_struttura',     title:"Codice struttura" },
    { key:'centro_costo',         title:"Centro costo" },
    { key:'codice_reparto_hl7',   title:"Codice reparto HL7" },
    { key:'codice_reparto_hl7_ds',title:"Descrizione codice" },
    { key:'unita_operativa',      title:"Unità operativa" },
  ]

  // TODO: filtro
  filter = '' // Stringa di filtro corrente
  filteredUnits: unitaOperativa[] = []; // Unità operative filtrate
  
  // Gestisce il cambiamento del filtro
  setFilter(e: Event) {
    const { value } = e.target as HTMLInputElement;
    this.filter = value.toLowerCase();
    this.applySortFilter();
  }
  
  // TODO: ordinamento 
  sortColumn: keyof unitaOperativa | null = null; // Colonna corrente per l'ordinamento
  sortDirection: 'asc' | 'desc' | '' = ''; // Direzione dell'ordinamento
  private isSortingManually = false; // Flag per sapere se l'ordinamento è stato fatto manualmente
  
  // Gestisce l'ordinamento per colonna
  orderColumn(column: keyof unitaOperativa) {
    // Segnala ordinamento manuale
    this.isSortingManually = true;  
    
    // Verifica se la colonna è già stata selezionata
    if (this.sortColumn === column) {
      // Cambia la direzione
      if (this.sortDirection === '') {
        this.sortDirection = 'asc';
      } else if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        this.sortDirection = '';
      }
    } else {
      // Nuova colonna - imposta l'ordinamento ascendente di default
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.applySortFilter();
  }
    
  // Applica sia il filtro che l'ordinamento
  applySortFilter() {
    // Filtra i dati per la stringa di filtro
    this.filteredUnits = this.uos.unitaOperative().filter(uo =>
      Object.values(uo).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(this.filter)
      )
    );
  
    // Applica la paginazione
    this.onChangePagination(null, null);
  
    // Dopo aver paginato, ordina solo i dati visibili
    if (this.sortColumn && this.sortDirection !== '') {
      this.unitaOperative = this.unitaOperative.sort((a, b) => {
        let valA = a[this.sortColumn!];
        let valB = b[this.sortColumn!];
  
        if (valA == null || valB == null) return 0;
  
        // Gestione speciale per il campo ID (numerico)
        if (this.sortColumn === 'id') {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          // Converti in minuscolo per confronto case-insensitive
          valA = typeof valA === 'string' ? valA.toLowerCase() : valA;
          valB = typeof valB === 'string' ? valB.toLowerCase() : valB;
        }
  
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }
  
  // TODO: paginazione
  paginationRecords = 10; // Numero di record per pagina
  paginationIndex = 1; // Pagina corrente
  
  // Callback per aggiornare i dati quando cambia la paginazione
  onChangePagination(newPaginationRecords: number | null, newPaginationIndex: number | null) {
    if (newPaginationRecords) this.paginationRecords = newPaginationRecords;
    if (newPaginationIndex) this.paginationIndex = newPaginationIndex;
  
    // Annulla l'ordinamento solo se l'utente cambia la pagina e non sta ordinando manualmente
    if (this.isSortingManually==false) {
      this.sortColumn = null;
      this.sortDirection = '';
    }
    this.changePagination();
    this.isSortingManually = false;
  }

  // Pagina le unità operative in base ai parametri correnti
  changePagination() {
    const start = (this.paginationIndex - 1) * this.paginationRecords;
    const end = this.paginationIndex * this.paginationRecords;
    this.unitaOperative = this.filteredUnits.slice(start, end);
  }
  
  // FIX DELETE 
  deleteTarger :number |undefined // ID dell'unità da eliminare
  
  // Esegue l'eliminazione dell'unità operativa
  deleteUnita(){
    if(this.deleteTarger) this.uos.delete(this.deleteTarger)
  }
  
  // FIX PUSH E PUT
  // MODAL
  originalFormValues: unitaOperativa | null = null; // Valori originali del form (per confronto)
  showErrors = false; // Flag per mostrare gli errori di validazione

  // MODAL E FORM
  isAddMode = true; // Flag per modalità aggiunta/modifica
  // Nel componente
  formFields = [
    { 
      key: 'codice_struttura', 
      label: 'Codice struttura', 
      type: 'text', 
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      hint: 'Il codice deve essere esattamente 6 caratteri'
    },
    { 
      key: 'unita_operativa', 
      label: 'Unità operativa', 
      type: 'text', 
      validators: [Validators.required] 
    },
    { 
      key: 'centro_costo', 
      label: 'Centro costo', 
      type: 'text', 
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      hint: 'Il centro costo deve essere esattamente 5 caratteri'
    },
    { 
      key: 'codice_reparto_hl7', 
      label: 'Codice reparto HL7', 
      type: 'text', 
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      hint: 'Il codice deve essere esattamente 6 caratteri'
    },
    { 
      key: 'codice_reparto_hl7_ds', 
      label: 'Descrizione codice', 
      type: 'text', 
      validators: [Validators.required] 
    }
  ];

  form: FormGroup;


  // Inizializza il form con i valori originali
  formInit(unit: unitaOperativa | undefined) {
    this.showErrors = false;
    
    if (unit == undefined) {
      // Modalità aggiunta - resetta il form
      this.isAddMode = true;
      this.form.reset(this.formReset());
      this.originalFormValues = null;
    } else {
      // Modalità modifica - popola il form con i valori esistenti
      this.isAddMode = false;
      this.form.patchValue(unit);
      this.originalFormValues = { ...unit }; // Salva i valori originali per il confronto
    }
  }

  // Resetta il form ai valori di default
  formReset(): unitaOperativa {
    this.removeActiveClass()
    return {
      id: -1,
      codice_struttura: '',
      unita_operativa: '',
      centro_costo: '',
      codice_reparto_hl7: '',
      codice_reparto_hl7_ds: '',
    };
  }
  
  // Rimuove la classe 'active' da tutte le label (funzione di utilità per UI)
  removeActiveClass() {
    const labels = document.querySelectorAll('label.active');
    labels.forEach(label => {
      label.classList.remove('active');
    });
  }
  
  // Verifica se il form è stato modificato rispetto ai valori originali
  isFormModified(): boolean {
    if (this.isAddMode) return true; // In modalità aggiunta, considera sempre modificato
    if (!this.originalFormValues) return false;
    
    return Object.keys(this.form.value).some(key => {
      const formKey = key as keyof unitaOperativa;
      return this.form.value[formKey] !== this.originalFormValues![formKey];
    });
  }

  // Gestione del submit del form
  onSubmit() {
    this.showErrors = this.isAddMode || this.form.invalid;
    
    if (this.form.invalid) return;
    if (!this.isAddMode && !this.isFormModified()) {
      return; // Non fare nulla se in modalità modifica e nessun campo è stato modificato
    }

    this.submitFormData();
  }

  // Invia i dati del form al servizio appropriato (POST o PATCH)
  private submitFormData() {
    if(!this.form.value.id) return;

    const formData: unitaOperativa = {
      id: this.form.value.id==-1 ?Math.floor(Math.random() * 1000) :this.form.value.id,
      codice_struttura: this.form.value.codice_struttura ?? '',
      unita_operativa: this.form.value.unita_operativa ?? '',
      centro_costo: this.form.value.centro_costo ?? '',
      codice_reparto_hl7: this.form.value.codice_reparto_hl7 ?? '',
      codice_reparto_hl7_ds: this.form.value.codice_reparto_hl7_ds ?? '',
    };
    
    // @ts-ignore // asseconda json server (TODO: trovare soluzione migliore)
    if(typeof formData.id==='number') formData.id =formData.id.toString()      
    
    if (this.isAddMode) {
      this.uos.post(formData); // Aggiungi nuova unità
    } else {
      this.uos.patch(formData.id, formData); // Modifica unità esistente
    }
  
    // Resetta il form dopo l'invio
    this.form.reset(this.formReset());
    this.originalFormValues = null;
  }
}