import { Component, effect } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { NavbarNavigazioneComponent } from "../../components/navbar-navigazione/navbar-navigazione.component";
import { ModalComponent } from '../../components/modal/modal.component';
import { BackToTopComponent } from "../../components/back-to-top/back-to-top.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { UnitaOperativeService } from '../../api/unita-operative.service';
import { NgFor, NgIf } from '@angular/common';
import unitaOperativa from '../../interfaces/unita-operative';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unita-operative',
  standalone: true,
  imports: [ModalComponent, HeaderComponent, NavbarNavigazioneComponent, BackToTopComponent, FooterComponent,
    NgFor, NgIf, FormsModule,
  ],
  templateUrl: './unita-operative.component.html',
  styleUrl: './unita-operative.component.sass'
})
export class UnitaOperativeComponent {
  constructor(public uos: UnitaOperativeService){
    effect(()=>{
      this.unitaOperative =uos.unitaOperative()
      console.log( 'effect', this.unitaOperative )
    })
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
  setFilter(e: Event) {
    const { value } = e.target as HTMLInputElement;
    this.filter = value;

    this.unitaOperative = this.uos.unitaOperative().filter(uo =>
      Object.values(uo).some(val =>
        typeof val === 'string' &&
        val.toLowerCase().includes(value.toLowerCase())
      )
    );
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
  
    let result = this.uos.unitaOperative().filter(uo =>
      Object.values(uo).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(value)
      )
    );
  
    if (this.sortColumn && this.sortDirection !== '') {
      result = result.sort((a, b) => {
        let valA = a[this.sortColumn!];
        let valB = b[this.sortColumn!];
    
        if (valA == null || valB == null) return 0;
    
        // Forza il confronto numerico se il campo è 'id'
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
      
    this.unitaOperative = result;
  }

  // DELETE 
  unitIdToDelete :number |undefined
  deleteUnita(){
    if(this.unitIdToDelete) this.uos.delete(this.unitIdToDelete)
  }
  
  

}
