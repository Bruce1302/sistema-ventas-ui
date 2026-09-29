import {Injectable, Service, signal} from '@angular/core';
import {Producto} from '../components/productos/productos.component';

export interface CarritoItem
{
  productoId: string;
  nombre: string;
  cantidad: number;
  subTotal: number;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CarritoService {

  carrito = signal<CarritoItem[]>([]);

  itemCarrito: CarritoItem = {productoId: '', nombre: '', cantidad: 0, subTotal: 0};

  agregarItem(producto: Producto)
  {
    let productoExiste = false;

    // Usamos update para transformar el arreglo completo y se actualice la vista
    this.carrito.update((itemsActuales) =>
    {

      // Recorremos el arreglo
      const nuevoArreglo = itemsActuales.map(item =>
      {
        //Si el producto existe, lo copiamos y actualizamos
        if (item.productoId === producto.id)
        {
          productoExiste = true;
          return {
            ...item,
            cantidad: item.cantidad + 1,
            subTotal: (item.cantidad + 1) * producto.precio
          };
        }
        return item;
      });

      //Si lo encontramos y modificamos, devolvemos el arreglo notificando el cambio
      if (productoExiste) {
        return nuevoArreglo;
      }

      // Si no existe, construimos el item localmente y lo añadimos
      const nuevoItem: CarritoItem = {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: 1,
        subTotal: producto.precio
      };

      return [...itemsActuales, nuevoItem];
    });

  }

  obtenerCarrito()
  {
    return this.carrito;
  }
}
