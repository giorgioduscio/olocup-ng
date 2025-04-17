import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template:`
    <div class="modal fade" tabindex="-1" [id]="modalId" attr.aria-labelledby="{{modalId}} Label" data-bs-backdrop="static">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>  `
})
export class ModalComponent {
  @Input() modalId! :string
}
