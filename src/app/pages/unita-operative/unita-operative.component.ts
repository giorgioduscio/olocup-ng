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
    effect(() => {
      this.filteredUnits = this.uos.unitaOperative(); // tutti i dati
      if (this.filteredUnits.length === 0) return;
      this.paginatedUnits();
    });
  }

  // VISUALIZZAZIONE
  unitaOperative: unitaOperativa[] = []
  nomiCampi :{key: keyof unitaOperativa, title:string}[] =[
    { key:'id',                   title:"Id" },
    { key:'codice_struttura',     title:"Codice struttura" },
    { key:'centro_costo',         title:"Centro costo" },
    { key:'codice_reparto_hl7',   title:"Codice reparto HL7" },
    { key:'codice_reparto_hl7_ds',title:"Descrizione codice" },
    { key:'unita_operativa',      title:"Unità operativa" },
  ]

  // FILTRI
  filter =''
  filteredUnits: unitaOperativa[] = [];
  setFilter(e: Event) {
    const { value } = e.target as HTMLInputElement;
    this.filter = value;
    this.applySortFilter();
  }
  
  // ORDINAMENTO
  sortColumn: keyof unitaOperativa | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';
  orderColumn(column: keyof unitaOperativa) {
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
      // Nuova colonna
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.applySortFilter();
  }
  applySortFilter() {
    const value = this.filter.toLowerCase();
  
    this.filteredUnits = this.uos.unitaOperative().filter(uo =>
      Object.values(uo).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(value)
      )
    );
  
    if (this.sortColumn && this.sortDirection !== '') {
      this.filteredUnits = this.filteredUnits.sort((a, b) => {
        let valA = a[this.sortColumn!];
        let valB = b[this.sortColumn!];
  
        if (valA == null || valB == null) return 0;
  
        if (this.sortColumn === 'id') {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = typeof valA === 'string' ? valA.toLowerCase() : valA;
          valB = typeof valB === 'string' ? valB.toLowerCase() : valB;
        }
  
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  
    this.paginationIndex = 1; // Reset alla prima pagina
    this.paginatedUnits();
  }
  
  // DELETE 
  unitIdToDelete :number |undefined
  deleteUnita(){
    if(this.unitIdToDelete) this.uos.delete(this.unitIdToDelete)
  }
  
  
  // MODAL
  // Aggiungi questa proprietà
  originalFormValues: unitaOperativa | null = null;
  showErrors = false;

  // MODAL E FORM
  isAddMode = true;
  form = new FormGroup({
    id: new FormControl(-1),
    codice_struttura: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    unita_operativa: new FormControl('', Validators.required),
    centro_costo: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    codice_reparto_hl7: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    codice_reparto_hl7_ds: new FormControl('', Validators.required),
  });

  // Inizializza il form con i valori originali
  formInit(unit: unitaOperativa | undefined) {
    this.showErrors = false;
    
    if (unit == undefined) {
      // Modalità aggiunta
      this.isAddMode = true;
      this.form.reset(this.formReset());
      this.originalFormValues = null;
    } else {
      // Modalità modifica
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
  removeActiveClass() {
    const labels = document.querySelectorAll('label.active');
    labels.forEach(label => {
      label.classList.remove('active');
    });
  }
  

  // Verifica se il form è stato modificato
  isFormModified(): boolean {
    if (this.isAddMode) return true; // In modalità aggiunta, considera sempre modificato
    if (!this.originalFormValues) return false;
    
    return Object.keys(this.form.value).some(key => {
      const formKey = key as keyof unitaOperativa;
      return this.form.value[formKey] !== this.originalFormValues![formKey];
    });
  }

  // Gestione del submit
  onSubmit() {
    this.showErrors = this.isAddMode || this.form.invalid;
    
    if (this.form.invalid) return;
    if (!this.isAddMode && !this.isFormModified()) {
      return; // Non fare nulla se in modalità modifica e nessun campo è stato modificato
    }

    this.submitFormData();
  }

  // Invia i dati del form
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
    
    // @ts-ignore // asseconda json server
    if(typeof formData.id==='number') formData.id =formData.id.toString()      
    
    if (this.isAddMode) this.uos.post(formData);
    else this.uos.patch(formData.id, formData);
  
    this.form.reset(this.formReset());
    this.originalFormValues = null;
  }


  // PAGINAZIONE 
  tableRecords = 10;
  paginationIndex = 1;
  updateDatasCallback(newTableRecords: number | null, newPaginationIndex: number | null) {
    if (newTableRecords) this.tableRecords = newTableRecords;
    if (newPaginationIndex) this.paginationIndex = newPaginationIndex;
    this.paginatedUnits();
  }
  paginatedUnits() {
    const start = (this.paginationIndex - 1) * this.tableRecords;
    const end = this.paginationIndex * this.tableRecords;
    this.unitaOperative = this.filteredUnits.slice(start, end);
  }
    

}
