import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { VentaService } from '../../../services/venta.service';
import { AuthService } from '../../../services/auth.service';
import { GrillaHeaderComponent } from './grilla-header/grilla-header.component';

@Component({
  imports: [
    DatePipe,
    GrillaHeaderComponent
  ],
  selector: 'app-grilla-ventas',
  styleUrl: './grilla-ventas.component.css',
  templateUrl: './grilla-ventas.component.html',
})
export class GrillaVentasComponent {

  private ventaService = inject(VentaService);

  private auth = inject(AuthService);

  ventasPaginadas = this.ventaService.ventasRealizadas;

  paginaActual = signal(0);

  usuarioRol = this.auth.usuarioRol

  ventaExpandida = signal<string | null>(null);

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

}
