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
  // el ? significa que es campo opcional
  tipoComprobante?: 'NOTA_VENTA' | 'BOLETA' | 'FACTURA';
  clienteTipoDoc?: string;
  clienteNumDoc?: string;
  clienteNombre?: string;
}

export interface VentaResponse
{
  id: string;
  total: number;
  detalles: DetalleVentaResponse[];
  cantidadProductosVendidos: number;
  fechaVenta: Date;
  tipoComprobante: string;
  serieNumero: string;
  externalId: string;
  estadoSunat: string;
  clienteNumDoc: string;
  clienteNombre: string;

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

  ticketParaImprimir = signal<VentaResponse | null>(null);

  imprimirTicketInterno(venta: VentaResponse) {
    this.ticketParaImprimir.set(venta);

    // Damos 50ms para que Angular dibuje el @if del ticket antes de abrir el diálogo de impresión
    setTimeout(() => {
      window.print();
    }, 50);

    // Limpiamos el Signal al cerrar el cuadro de impresión
    window.onafterprint = () => {
      this.ticketParaImprimir.set(null);
    };
  }


  nuevaVenta(ventaRequest: VentaRequest)
  {
    return this.http.post<VentaResponse>(this.apiUrl, ventaRequest);

  }

  descargarPdf(ventaId: string, formato: 'ticket' | 'a4' = 'ticket')
  {
    return this.http.get(`${this.apiUrl}/${ventaId}/pdf?formato=${formato}`, {
      responseType: 'blob'
    });
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
