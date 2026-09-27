import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../components/productos/productos.component';


@Injectable(
  {
    providedIn: 'root' // servicio disponible para toda la aplicación
  }
)
export class ProductoService {

  //Direccion del API
  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos()
  {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}
