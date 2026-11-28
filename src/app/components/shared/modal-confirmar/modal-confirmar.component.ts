import { Component, inject } from '@angular/core';
import { ConfirmacionService } from '../../../services/confirmacion.service';

@Component({
  imports: [],
  selector: 'app-modal-confirmar',
  styleUrl: './modal-confirmar.component.css',
  templateUrl: './modal-confirmar.component.html',
})
export class ModalConfirmarComponent {
  confirmacionService = inject(ConfirmacionService);
  datos = this.confirmacionService.config;
}
