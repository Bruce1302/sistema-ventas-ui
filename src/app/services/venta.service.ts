import { inject, Injectable, Service, signal } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from './auth.service';

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

export interface pageVentasResponse
{
  content: VentaResponse[];
  totalPages: number;
  totalElements: number;
}

@Injectable(
  {
    providedIn: 'root'
  }
)

export class VentaService {

  private apiUrl = 'http://localhost:8080/ventas';

  private http = inject(HttpClient)

  ventasRealizadas = signal<pageVentasResponse | null>(null);


  nuevaVenta(ventaRequest: VentaRequest)
  {
    return this.http.post(this.apiUrl, ventaRequest);
  }

  obtenerVentas(page: number)
  {
    return this.http.get<pageVentasResponse>(`${this.apiUrl}?page=${page}&size=10`).subscribe({
      next: (response: pageVentasResponse) =>
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




}
