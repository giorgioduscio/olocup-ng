import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.sass']
})
export class PaginationComponent implements OnChanges {
  @Input({required:true}) 
    onChangePagination! :(newpaginationRecords: number | null, newPaginationIndex: number | null) => void;
  @Input({required:true}) totalItems: number = 0;  // Numero totale di elementi
  @Input() options: number[] = [5, 10, 20, 50, 100];


  itemsPerPage = 10;      // Numero di elementi visualizzati per pagina
  currentPage = 1;        // Pagina corrente
  totalPages = 0;         // Totale pagine
  startPage = 1;          // Prima pagina nel range
  endPage = 1;            // Ultima pagina nel range

  ngOnChanges(changes: SimpleChanges): void {
    // Ogni volta che totalItems o itemsPerPage cambia, aggiorna la paginazione
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.updatePagination();      
    }
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;

    this.currentPage = newPage;
    this.onChangePagination(this.itemsPerPage, this.currentPage); // Notifica il padre
    this.updatePagination();
  }

  changeItemsPerPage(newItemsPerPage: number): void {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1; // Reset alla prima pagina
    this.onChangePagination(this.itemsPerPage, this.currentPage); // Notifica il padre
    this.updatePagination();
  }

  getPageRange(startPage: number, endPage: number): number[] {
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  updatePagination(): void {
    // Calcola il numero totale di pagine in base al numero totale di elementi e gli elementi per pagina
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    if (this.totalPages > 1) {
      this.startPage = Math.max(1, this.currentPage - 2);
      this.endPage = Math.min(this.totalPages, this.currentPage + 2);

      if (this.currentPage <= 3) {
        this.endPage = Math.min(5, this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        this.startPage = Math.max(this.totalPages - 4, 1);
      }
    } else {
      this.startPage = 1;
      this.endPage = 1;
    }
  }
}
