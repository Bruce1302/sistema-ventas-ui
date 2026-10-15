import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {CarritoItem, CarritoService} from '../../services/carrito.service';
import {DetallesVenta, VentaRequest, VentaService} from '../../services/venta.service';
import {ProductoService} from '../../services/producto.service';
import { DecimalPipe, NgClass } from '@angular/common';

@Component({
  imports: [
    NgClass,
    DecimalPipe
  ],
  selector: 'app-carrito',
  styleUrl: './carrito.component.css',
  templateUrl: './carrito.component.html',
})
export class CarritoComponent  {

  private carritoService = inject(CarritoService);
  private ventaService = inject(VentaService);
  private productoService = inject(ProductoService);

  listaCarrito = this.carritoService.obtenerCarrito();

  total = computed(() => {
    return this.listaCarrito().reduce((acumulador, item) => acumulador + item.subTotal, 0);
  });

  subtotal = computed(() => {
    return this.total() / 1.18;
  });

  igv = computed(() => {
    return this.total() - this.subtotal();
  });

  quitarItem(productoId: string)
  {
    this.carritoService.quitarItem(productoId);
  }


  nuevaVenta()
  {
    //Creamos un array con los detalles de la venta y agreagmos los datos necesarios del carrito
    const listaDetalles: DetallesVenta[]  = this.listaCarrito().map(item => (
      { productoId: item.productoId, cantidad: item.cantidad }));

    //detalles en la clave de propiedad del json, el api necesita la estructura { detalles: [ lista de los productos a vender] }
    const ventaRequest: VentaRequest = { detalles: listaDetalles };

    //los enviamos al api
    this.ventaService.nuevaVenta(ventaRequest).subscribe(
      {
        next: () => {
          this.carritoService.limpiarCarrito();
          this.productoService.obtenerTopProductos();
          console.log('Venta realizada con éxito \n' + listaDetalles);
        },

        error: (error) => {
          console.error('Error al realizar la venta:', error);
        }

      }
    );
  }
}
