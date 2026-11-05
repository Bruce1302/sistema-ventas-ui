import { inject, Injectable, Service, signal } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from './auth.service';
import {PageResponse} from '../models/pagination.model';

export interface DetallesVenta
{
  productoId: string;
  cantidad: number;
}

export interface VentaRequest
{
  detalles: DetallesVenta[];
}

export interface VentaResponse
{
  id: string;
  total: number;
  detalles: DetalleVentaResponse[];
  cantidadProductosVendidos: number;
  fechaVenta: Date;

}

export interface DetalleVentaResponse
{
  id: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subTotal: number;

}

@Injectable(
  {
    providedIn: 'root'
  }
)

export class VentaService {

  private apiUrl = 'http://localhost:8080/ventas';

  private http = inject(HttpClient)

  ventasRealizadas = signal<PageResponse<VentaResponse> | null>(null);


  nuevaVenta(ventaRequest: VentaRequest)
  {
    return this.http.post(this.apiUrl, ventaRequest);
  }

  obtenerVentas(page: number)
  {
    return this.http.get<PageResponse<VentaResponse>>(`${this.apiUrl}?page=${page}&size=10`).subscribe({
      next: (response: PageResponse<VentaResponse>) =>
      {
        this.ventasRealizadas.set(response);
        console.log("ventas cargadas con exito");
      },
      error: (error) =>
      {
        console.error("Error al obtener ventas:", error);
      }
    });
  }

  eliminarVenta(id: string)
  {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  filtrarFecha(fechaInicio: Date, fechaFin: Date, page: number)
  {
    // Convertimos las fechas a formato ISO para Spring Boot
    const url = `${this.apiUrl}/filtrar?fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}&page=${page}&size=10`;

    this.http.get<PageResponse<VentaResponse>>(url).subscribe({
      next: (respuesta) =>
      {
        this.ventasRealizadas.set(respuesta);
        console.log(fechaInicio.toISOString());
        console.log(fechaFin.toISOString());
      },
      error: (error) => console.error('Error al filtrar ventas por fecha:', error)
    });

  }




}
