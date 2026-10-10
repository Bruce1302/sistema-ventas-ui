import {Injectable, Service, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../components/productos/productos.component';
import {CarritoService} from './carrito.service';

export interface PageProductoResponse
{
  content: Producto[];
  totalPages: number;
  totalElements: number;
}

@Injectable(
  {
    providedIn: 'root' // servicio disponible para toda la aplicación
  }
)
export class ProductoService {

  productos = signal(<Producto[]>([]));
  productosPaginados = signal<PageProductoResponse | null>(null);

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

  obtenerProductosPaginados(page: number)
  {
    this.http.get<PageProductoResponse>(`${this.apiUrl}?page=${page}&size=10`).subscribe({
      next: (response: PageProductoResponse) => {
        this.productosPaginados.set(response);
        console.log(`Productos de la página ${page} cargados con éxito`);
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  eliminarProducto(id: string)
  {
    this.http.delete(`${this.apiUrl}/${id}`);
  }

  agregarProducto(producto: Producto)
  {
    return this.http.post(this.apiUrl, producto);
  }

}
