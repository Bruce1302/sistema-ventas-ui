import {inject, Injectable, Service, signal} from '@angular/core';
import {Producto} from '../components/productos/productos.component';

export interface CarritoItem
{
  productoId: string;
  nombre: string;
  cantidad: number;
  subTotal: number;
  stock: number;
  precio: number;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CarritoService {

  carrito = signal<CarritoItem[]>([]);


  itemCarrito: CarritoItem = {productoId: '', nombre: '', cantidad: 0, subTotal: 0, precio: 0, stock: 0};

  agregarItem(producto: Producto, cantidad: string)
  {
    const cantidadNum = parseInt(cantidad);
     // averiguamos si el producto ya existe en la forma actual del carrito
    const existe = this.carrito().find(item => item.productoId === producto.id);
    if (existe)//Si existe aumentamos la cantidad
      this.aumentarCantidad(producto, cantidadNum);
    else //Si el producto es nuevo, lo agregamos
    {
      // construimos el ítem y lo insertamos de forma inmutable
      const nuevoItem: CarritoItem = {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: cantidadNum,
        subTotal: producto.precio * cantidadNum,
        stock: producto.stock,
        precio: producto.precio
      };
      this.carrito.update(items => [...items, nuevoItem]);
    }

  }

  aumentarCantidad(producto: Producto, cantidad: number)
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
            cantidad: item.cantidad + cantidad,
            subTotal: (item.cantidad + cantidad) * producto.precio
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
