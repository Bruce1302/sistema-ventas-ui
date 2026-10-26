import {Component, inject} from '@angular/core';
import {ToastService} from '../../../services/toast.service';

@Component({
  imports: [],
  selector: 'app-toast',
  styleUrl: './toast.component.css',
  templateUrl: './toast.component.html',
})
export class ToastComponent {

  toastService = inject(ToastService);
  toast = this.toastService.toastConfig

  cerrarManual()
  {
    this.toastService.cerrarToast();
  }
}
