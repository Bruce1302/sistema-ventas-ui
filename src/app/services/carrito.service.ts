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
     // averiguamos si el producto ya existe en la forma actual del carrito
    const existe = this.carrito().find(item => item.productoId === producto.id);

    if (existe)//Si existe aumentamos la cantidad
      this.aumentarCantidad(producto);
    else //Si el producto es nuevo, lo agregamos
    {
      // construimos el ítem y lo insertamos de forma inmutable
      const nuevoItem: CarritoItem = {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: 1,
        subTotal: producto.precio
      };
      this.carrito.update(items => [...items, nuevoItem]);
    }

  }

  aumentarCantidad(producto: Producto)
  {
    this.carrito.update((itemsActuales) =>
    {
      const nuevoArreglo = itemsActuales.map(item =>
      {
        //Buscamos el producto
        if (item.productoId === producto.id)
        {
          //Devolvemos el item actualizado
          return {
            ...item,
            cantidad: item.cantidad + 1,
            subTotal: (item.cantidad + 1) * producto.precio
          };
        }
        return item;
      });
      return nuevoArreglo;
    });

  }

  calcularTotal()
  {

  }

  limpiarCarrito()
  {
    this.carrito.set([]);
  }

  quitarItem(productoId: string)
  {
    this.carrito.update((itemsActuales) =>
    {
      return itemsActuales.filter(item => item.productoId !== productoId);
    });
  }

  obtenerCarrito()
  {
    return this.carrito;
  }


}
