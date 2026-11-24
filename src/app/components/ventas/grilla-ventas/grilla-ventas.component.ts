import { Component, computed, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, TitleCasePipe } from '@angular/common';
import { VentaResponse, VentaService } from '../../../services/venta.service';
import { AuthService } from '../../../services/auth.service';
import { GrillaHeaderComponent } from './grilla-header/grilla-header.component';
import { ToastService } from '../../../services/toast.service';
import { TicketInternoComponent } from '../../ticket-interno/ticket-interno.component';
import { TiendaService } from '../../../services/tienda.service';

@Component({
  imports: [
    DatePipe,
    GrillaHeaderComponent,
    NgClass,
    DecimalPipe,
    TitleCasePipe,
    TicketInternoComponent
  ],
  selector: 'app-grilla-ventas',
  styleUrl: './grilla-ventas.component.css',
  templateUrl: './grilla-ventas.component.html',

})
export class GrillaVentasComponent implements OnInit{

  private ventaService = inject(VentaService);
  private tiendaService = inject(TiendaService);
  private toastService = inject(ToastService);
  private auth = inject(AuthService);

  ventasPaginadas = this.ventaService.ventasRealizadas;

  paginaActual = signal(0);

  usuarioRol = this.auth.usuarioRol

  ventaExpandida = signal<string | null>(null);

  procesandoComprobante = signal<boolean>(false);

  reenviando = signal<string | null>(null);

  ticketParaImprimir = signal<VentaResponse | null >(null);

  tiendaActual = this.tiendaService.tiendaActual;

  ngOnInit(): void
  {
    this.cambiarPagina(this.paginaActual());
  }

  toggleDetalles(id: string)
  {
    this.ventaExpandida.update(actual => actual === id ? null : id);
  }

  //cuando se requieran ver mas ventas
  cambiarPagina(nuevaPagina: number)
  {
    this.paginaActual.set(nuevaPagina);

    //le pasamos el bloque de ventas que necesitamos
    this.ventaService.obtenerVentas(nuevaPagina);

  }

  imprimirComprobante(id: string)
  {
    if (this.procesandoComprobante()) return;
    this.procesandoComprobante.set(true)

    this.ventaService.descargarPdf(id, 'ticket').subscribe({
      next: (pdfBlob: Blob) =>
      {
        const url = URL.createObjectURL(pdfBlob);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
          }, 60000);
        };
        this.procesandoComprobante.set(false);
      },
      error: (error) => {
        this.procesandoComprobante.set(false);
        console.error('Error al descargar el PDF:', error);
        this.toastService.mostrar('No se pudo cargar el comprobante para imprimir.', 'error');
      }
    });
  }

  imprimirTicket(venta: VentaResponse)
  {
    this.ventaService.imprimirTicketInterno(venta);
  }

  eliminarVenta(id: string)
  {
    this.ventaService.eliminarVenta(id).subscribe({
      next: () =>
      {
        this.cambiarPagina(this.paginaActual());
        console.log('Venta eliminada');
      },
      error: (error) =>
      {
        console.log('Error al eliminar la venta');
      }
    })
  }

  reenviarVenta(id: string)
  {
    if (this.reenviando()) return;

    this.reenviando.set(id);
    console.log(this.reenviando());

    this.ventaService.reenviarVenta(id).subscribe({
      next: (ventaActualizada) =>
      {
        if (ventaActualizada.estadoSunat === 'ACEPTADO')
          this.toastService.mostrar('¡Comprobante aceptado por SUNAT!', 'exito');
        else if (ventaActualizada.estadoSunat === 'RECHAZADO')
          this.toastService.mostrar('SUNAT rechazó el comprobante.', 'error');
        else
          this.toastService.mostrar('SUNAT aún no responde. Sigue en estado Pendiente.', 'info');

        this.cambiarPagina(this.paginaActual());
        this.reenviando.set(null);
      },
      error: (error) =>
      {
        console.log('Error al reenviar la venta');
        this.toastService.mostrar('Hubo un error al reenviar la venta', 'error');
        this.reenviando.set(null);
      }
    })
  }

}
