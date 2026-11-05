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

  // Limite para el calendario
  fechaMaxima: string = '';

  ngOnInit() {
    // hacemo que hoy sea el tope para las fechas en el calendario
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000;
    this.fechaMaxima = new Date(hoy.getTime() - offset).toISOString().split('T')[0];
  }

  aplicarFiltroCalendario(evento: Event)
  {
    const valor = (evento.target as HTMLInputElement).value;

    // Si el usuario borra la fecha, restauramos la grilla completa
    if (!valor) {
      this.ventaService.obtenerVentas(0);
      return;
    }

    // Armamos los limites forzando la hora desde las 00:00 hasta las 23:59 del dia elegido
    const fechaInicio = new Date(`${valor}T00:00:00`);
    const fechaFin = new Date(`${valor}T23:59:59.999`);

    //usamos el mismo metodo para filtrar
    this.ventaService.filtrarFecha(fechaInicio, fechaFin, 0);
  }

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
