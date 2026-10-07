import { Component, inject, OnInit, signal } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { DatePipe } from '@angular/common';

@Component({
  imports: [
    DatePipe
  ],
  selector: 'app-ventas',
  styleUrl: './ventas.component.css',
  templateUrl: './ventas.component.html',
})
export class VentasComponent implements OnInit
{
  private ventaService = inject(VentaService);

  ventasPaginadas = this.ventaService.ventasRealizadas;

  paginaActual = signal(0);

  ngOnInit(): void
  {
    this.cambiarPagina(this.paginaActual());
  }

  //cuando se requieran ver mas ventas
  cambiarPagina(nuevaPagina: number)
  {
    this.paginaActual.set(nuevaPagina);

    //le pasamos el bloque de ventas que necesitamos
    this.ventaService.obtenerVentas(nuevaPagina);
  }
}
