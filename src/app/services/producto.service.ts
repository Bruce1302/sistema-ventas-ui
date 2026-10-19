import {Injectable, Service, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../components/productos/productos.component';
import {CarritoService} from './carrito.service';
import {PageResponse} from '../models/pagination.model';

@Injectable(
  {
    providedIn: 'root' // servicio disponible para toda la aplicación
  }
)
export class ProductoService {

  topProductos = signal(<Producto[]>([]));
  productosPaginados = signal<PageResponse<Producto> | null>(null);

  paginaActual = signal(0);


  //Direccion del API
  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  obtenerTopProductos()
  {
    const topProductos = 'http://localhost:8080/productos/top';

    this.http.get<Producto[]>(topProductos).subscribe({

      next: (productos: Producto[]) =>
      {
        this.topProductos.set(productos);
        console.log('productos cargados con exito:', this.topProductos);
      },

      error: (error) =>
      {
        console.log('No se pudieron obtener los productos', error);
      }
    });
  }

  obtenerProductosPaginados(page: number)
  {
    this.http.get<PageResponse<Producto>>(`${this.apiUrl}?page=${page}&size=10`).subscribe({
      next: (response: PageResponse<Producto>) => {
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

  buscarProductos(termino: string)
  {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar?nombre=${termino}`);
  }

}
