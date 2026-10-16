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

  agregarItem(producto: Producto, cantidadSeleccionada: number) {
    const existe = this.carrito().find(item => item.productoId === producto.id);

    if (existe) {
      // Si ya existe, le sumamos la cantidad exacta que escribió el cajero
      this.carrito.update(items => items.map(item => {
        if (item.productoId === producto.id) {
          const nuevaCantidad = item.cantidad + cantidadSeleccionada;
          return {
            ...item,
            cantidad: nuevaCantidad,
            subTotal: nuevaCantidad * producto.precio
          };
        }
        return item;
      }));
    } else {
      // Si es nuevo, lo registramos con la cantidad inicial
      const nuevoItem: CarritoItem = {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: cantidadSeleccionada,
        subTotal: producto.precio * cantidadSeleccionada,
        stock: producto.stock, // Si guardas el stock en tu interfaz actual
        precio: producto.precio // Si guardas el precio unitario en tu interfaz
      };
      this.carrito.update(items => [...items, nuevoItem]);
    }
  }

  aumentarCantidad(productoId: string)
  {
    this.carrito.update(items => items.map(item => {
      if (item.productoId === productoId && item.cantidad < item.stock)
      {

        // Calculamos el precio base dividiendo el subtotal entre la cantidad actual
        const precioUnitario = item.subTotal / item.cantidad;
        const nuevaCantidad = item.cantidad + 1;

        return {
          ...item,
          cantidad: nuevaCantidad,
          subTotal: nuevaCantidad * precioUnitario
        };
      }
      return item;
    }));
  }

  disminuirCantidad(productoId: string)
  {
    this.carrito.update(items => items.map(item => {
      // Solo aplicamos la resta si la cantidad actual es mayor a 1
      if (item.productoId === productoId && item.cantidad > 1 )
      {
        const precioUnitario = item.subTotal / item.cantidad;
        const nuevaCantidad = item.cantidad - 1;

        return {
          ...item,
          cantidad: nuevaCantidad,
          subTotal: nuevaCantidad * precioUnitario
        };
      }
      return item;
    }));
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
