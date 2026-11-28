import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/shared/toast/toast.component';
import { VentaService } from './services/venta.service';
import { TiendaService } from './services/tienda.service';
import { TicketInternoComponent } from './components/ticket-interno/ticket-interno.component';
import { ModalConfirmarComponent } from './components/shared/modal-confirmar/modal-confirmar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TicketInternoComponent, ToastComponent, ModalConfirmarComponent],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('sistema-ventas-ui');

  private ventaService = inject(VentaService);
  private tiendaService = inject(TiendaService);

  ticketParaImprimir = this.ventaService.ticketParaImprimir;
  tiendaActual = this.tiendaService.tiendaActual;
}
