import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../components/productos/productos.component';
import {CarritoService} from './carrito.service';


@Injectable(
  {
    providedIn: 'root' // servicio disponible para toda la aplicación
  }
)
export class ProductoService {

  //Direccion del API
  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  obtenerProductos()
  {
    return this.http.get<Producto[]>(this.apiUrl);
  }

}
