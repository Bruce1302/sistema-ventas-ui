import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import {CarritoItem, CarritoService} from '../../services/carrito.service';
import { DetallesVenta, VentaRequest, VentaResponse, VentaService } from '../../services/venta.service';
import {ProductoService} from '../../services/producto.service';
import { DecimalPipe, NgClass } from '@angular/common';
import { Producto, ProductosComponent } from '../productos/productos.component';
import { ToastService } from '../../services/toast.service';
import { TiendaService } from '../../services/tienda.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [
    NgClass,
    DecimalPipe,
    ReactiveFormsModule
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
        this.idempotencyKeyActual = null;
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

  procesandoVenta = signal<boolean>(false);

  private idempotencyKeyActual: string | null = null;

  formularioValido = computed(() => {
    const tipo = this.tipoComprobante();
    const doc = this.clienteNumDoc().trim();
    const nombre = this.clienteNombre().trim();

    // ticket simple siempre válido
    if (tipo === 'NOTA_VENTA') return true;

    // Boleta es con DNI opcional si < 700, obligatorio si el total es >= 700, y nombre obligatorio si es Carnet de extranjeria
    if (tipo === 'BOLETA')
    {
      if (this.total() >= 700 && doc.length < 8) return false;
      if (doc.length > 0 && doc.length < 8) return false;
      return !(doc.length > 8 && nombre.length === 0);
    }

    // factura RUC tiene 11 dígitos y Razón Social obligatorios siempre
    if (tipo === 'FACTURA') return doc.length === 11 && nombre.length > 0;

    return false;
  });

  toggleCarrito()
  {
    this.carritoAbierto = !this.carritoAbierto;
  }

  quitarItem(productoId: string)
  {
    this.carritoService.quitarItem(productoId);
    this.idempotencyKeyActual = null;
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
    const tipo = this.tipoComprobante();
    const doc = this.clienteNumDoc().trim();
    const nombre = this.clienteNombre().trim();

    if (!this.idempotencyKeyActual)
      this.idempotencyKeyActual = crypto.randomUUID();

    if (this.tipoComprobante() === 'BOLETA')
    {
      if (this.total() >= 700 && doc.length < 8)
      {
        this.toastService.mostrar('Para boletas de S/ 700 o más el documento es obligatorio.', 'info');
        return;
      }

      if (doc.length > 0 && doc.length < 8)
      {
        this.toastService.mostrar('El DNI debe tener 8 dígitos (o más de 8 para C.E.).', 'info');
        return;
      }

      if (doc.length > 8 && !nombre)
      {
        this.toastService.mostrar('Para Carné de Extranjería debes ingresar el nombre del cliente.', 'info');
        return;
      }
    }

    if (tipo === 'FACTURA')
      if (doc.length !== 11 || !nombre)
      {
        this.toastService.mostrar('Para Factura debes ingresar un RUC de 11 dígitos y la Razón Social.', 'info');
        return;
      }

    //Creamos un array con los detalles de la venta y agreagmos los datos necesarios del carrito
    const listaDetalles: DetallesVenta[]  = this.listaCarrito().map(item => (
      { productoId: item.productoId, cantidad: item.cantidad }));

    //Creamos le venta request
    const ventaRequest: VentaRequest = {
      detalles: listaDetalles,
      tipoComprobante: tipo
    };

    if (tipo === 'BOLETA' && doc.length >= 8) //cuando se use carnet de extranjeria
    {
      ventaRequest.clienteTipoDoc = doc.length === 8 ? '1' : '4'; // '1' = DNI, '4' = C.E
      ventaRequest.clienteNumDoc = doc;
      if (nombre)
        ventaRequest.clienteNombre = nombre;

    }
    else if (tipo === 'FACTURA')
    {
      ventaRequest.clienteTipoDoc = '6'; // '6' = RUC
      ventaRequest.clienteNumDoc = doc;
      ventaRequest.clienteNombre = nombre;
    }

    //evitamos que se envien dobles consultas
    if (this.procesandoVenta()) return;
    this.procesandoVenta.set(true)

    //los enviamos al api
    this.ventaService.nuevaVenta(ventaRequest, this.idempotencyKeyActual).subscribe(
      {
        next: (ventaCreada: VentaResponse) =>
        {
          this.carritoService.limpiarCarrito();
          this.procesandoVenta.set(false);
          this.seleccionarComprobante('NOTA_VENTA');
          this.productoService.obtenerTopProductos();
          this.toastService.mostrar('¡Venta realizada con éxito.!', 'exito');
          this.idempotencyKeyActual = null;

          if (ventaCreada.externalId)
            this.abrirComprobantePdf(ventaCreada.id);
          else
            this.ventaService.imprimirTicketInterno(ventaCreada);

        },

        error: (error) => {
          this.procesandoVenta.set(false);
          console.error('Error al realizar la venta:', error);
          this.toastService.mostrar('Hubo un error al realizar la venta.', 'error');
        }

      }
    );
  }

  private abrirComprobantePdf(ventaId: string)
  {
    this.ventaService.descargarPdf(ventaId, 'ticket').subscribe({
      next: (pdfBlob: Blob) => {
        const url = URL.createObjectURL(pdfBlob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
          }, 60000);
        };
      },
      error: (error) => {
        console.error('Error al descargar el PDF:', error);
        this.toastService.mostrar('Venta guardada, pero no se pudo abrir el comprobante.', 'info');
      }
    });
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
