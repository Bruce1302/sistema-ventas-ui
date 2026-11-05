import { Component, inject } from '@angular/core';
import { VentaService } from '../../../../services/venta.service';

@Component({
  imports: [],
  selector: 'app-grilla-header',
  styleUrl: './grilla-header.component.css',
  templateUrl: './grilla-header.component.html',
})
export class GrillaHeaderComponent {

    private ventaService = inject(VentaService);

  aplicarFiltroRapido(evento: Event) {
    const valor = (evento.target as HTMLSelectElement).value;

    // Si eligen "Todos" volvemos a la carga normal
    if (!valor || valor === 'todos') {
      this.ventaService.obtenerVentas(0);
      return;
    }

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    switch (valor) {
      case 'hoy':
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'ayer':
        fechaInicio.setDate(fechaInicio.getDate() - 1);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setDate(fechaFin.getDate() - 1);
        fechaFin.setHours(23, 59, 59, 999);
        break;
      case 'semana':
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'mes':
        fechaInicio.setDate(fechaInicio.getDate() - 30);
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      default:
        return;
    }

    this.ventaService.filtrarFecha(fechaInicio, fechaFin, 0);
  }
}
