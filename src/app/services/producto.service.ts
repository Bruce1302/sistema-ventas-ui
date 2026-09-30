import {Injectable, Service, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../components/productos/productos.component';
import {CarritoService} from './carrito.service';


@Injectable(
  {
    providedIn: 'root' // servicio disponible para toda la aplicación
  }
)
export class ProductoService {

  productos = signal(<Producto[]>([]));

  //Direccion del API
  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  obtenerProductos()
  {
    this.http.get<Producto[]>(this.apiUrl).subscribe({

      next: (respuesta: any) =>
      {
        this.productos.set(respuesta.content);
        console.log('productos cargados con exito:', this.productos);
      },

      error: (error) =>
      {
        console.log('No se pudieron obtener los productos', error);
      }
    });
  }

}
