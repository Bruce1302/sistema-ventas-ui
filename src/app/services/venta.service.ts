import {inject, Injectable, Service} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface DetallesVenta
{
  productoId: string;
  cantidad: number;
}

export interface VentaRequest
{
  detalles: DetallesVenta[];
}

@Injectable(
  {
    providedIn: 'root'
  }
)

export class VentaService {

  private apiUrl = 'http://localhost:8080/ventas';

  private http = inject(HttpClient)

  nuevaVenta(ventaRequest: VentaRequest)
  {
    return this.http.post(this.apiUrl, ventaRequest);
  }

}
