import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import {CarritoItem, CarritoService} from '../../services/carrito.service';
import {DetallesVenta, VentaRequest, VentaService} from '../../services/venta.service';
import {ProductoService} from '../../services/producto.service';
import { DecimalPipe, NgClass } from '@angular/common';
import { Producto, ProductosComponent } from '../productos/productos.component';
import { ToastService } from '../../services/toast.service';
import { TiendaService } from '../../services/tienda.service';

@Component({
  imports: [
    NgClass,
    DecimalPipe
  ],
  selector: 'app-carrito',
  styleUrl: './carrito.component.css',
  templateUrl: './carrito.component.html',
})
export class CarritoComponent {

  constructor() {
    effect(() => {
      if (this.listaCarrito().length === 0) {
        this.seleccionarComprobante('NOTA_VENTA');
      }
    });
  }

  private toastService = inject(ToastService);
  private carritoService = inject(CarritoService);
  private ventaService = inject(VentaService);
  private productoService = inject(ProductoService);
  private tiendaService = inject(TiendaService);

  //efecto del menu del carrito
  carritoAbierto = false;

  listaCarrito = this.carritoService.obtenerCarrito();

  tiendaActual = this.tiendaService.tiendaActual;

  total = computed(() => {
    return this.listaCarrito().reduce((acumulador, item) => acumulador + item.subTotal, 0);
  });

  subtotal = computed(() => {
    return this.total() / 1.18;
  });

  igv = computed(() => {
    return this.total() - this.subtotal();
  });

  tipoComprobante = signal<'NOTA_VENTA' | 'BOLETA' | 'FACTURA'>('NOTA_VENTA');

  clienteNumDoc = signal<string>('');

  clienteNombre = signal<string>('');

  toggleCarrito()
  {
    this.carritoAbierto = !this.carritoAbierto;
  }

  quitarItem(productoId: string)
  {
    this.carritoService.quitarItem(productoId);
  }

  aumentarCantidad(id: string)
  {
    this.carritoService.aumentarCantidad(id);
  }

  disminuirCantidad(id: string)
  {
    this.carritoService.disminuirCantidad(id);
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
          this.toastService.mostrar('¡Venta realizada con éxito.!', 'exito');
          console.log('Venta realizada con éxito \n' + listaDetalles);
        },

        error: (error) => {
          console.error('Error al realizar la venta:', error);
          this.toastService.mostrar('Hubo un error al realizar la venta.', 'error');
        }

      }
    );
  }

  seleccionarComprobante(tipo: 'NOTA_VENTA' | 'BOLETA' | 'FACTURA')
  {
    this.tipoComprobante.set(tipo);
    this.clienteNombre.set('');
    this.clienteNumDoc.set('');
  }

  limpiarCarrito()
  {
    this.carritoService.limpiarCarrito();
  }
}
