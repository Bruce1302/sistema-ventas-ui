import { inject, Injectable, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../components/productos/productos.component';
import {CarritoService} from './carrito.service';
import {PageResponse} from '../models/pagination.model';
import { ToastService } from './toast.service';

@Injectable(
  {
    providedIn: 'root' // servicio disponible para toda la aplicación
  }
)

export class ProductoService {

  topProductos = signal(<Producto[]>([]));
  productosPaginados = signal<PageResponse<Producto> | null>(null);

  paginaActual = signal(0);

  //almacenara el estado de la barra de busqueda, si contiene algo o si tiene algun texto
  terminoBusqueda = signal<string>('');


  //Direccion del API
  private apiUrl = 'http://localhost:8080/productos';
  private toastService = inject(ToastService);

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
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        console.log('Producto eliminado con éxito');
        this.obtenerProductosPaginados(this.paginaActual());
        this.toastService.mostrar('Producto eliminado exitosamente', 'exito');
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    });
  }

  agregarProducto(producto: Producto)
  {
    return this.http.post(this.apiUrl, producto);
  }

  buscarProductos(termino: string)
  {
    this.terminoBusqueda.set(termino);
    return this.http.get<PageResponse<Producto>>(`${this.apiUrl}/buscar?nombre=${termino}`);
  }

  actualizarProducto( producto: Producto, id: string)
  {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  filtrarPorCategorias(categoriasIds: string[]) {
    // Si nos mandan un arreglo vacio, volvemos a cargar la pagina 0
    if (!categoriasIds || categoriasIds.length === 0)
    {
      this.obtenerProductosPaginados(0);
      return;
    }

    // Convertimos el arreglo de ids en un texto separado por comas para la URL
    const categoriasParam = categoriasIds.join(',');

    this.http.get<PageResponse<Producto>>(`${this.apiUrl}/filtrar?categorias=${categoriasParam}&page=0&size=10`)
      .subscribe({
        next: (respuesta: PageResponse<Producto>) => {

          // la Grilla reacciona y le damos los datos del filtro reemplazando los productos originales
          this.productosPaginados.set(respuesta);
          // Reseteamos tu página global a 0 para los botones de la grilla
          this.paginaActual.set(0);
        },
        error: (error) => console.error('Error al filtrar categorías:', error)
      });
  }

}
