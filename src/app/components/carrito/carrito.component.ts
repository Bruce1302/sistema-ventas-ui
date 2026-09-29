import {Component, inject, OnInit, signal} from '@angular/core';
import {CarritoItem, CarritoService} from '../../services/carrito.service';

@Component({
  imports: [],
  selector: 'app-carrito',
  styleUrl: './carrito.component.css',
  templateUrl: './carrito.component.html',
})
export class CarritoComponent  {

  private carritoService = inject(CarritoService);

  listaCarrito = this.carritoService.obtenerCarrito();


  quitarItem(productoId: string)
  {
    this.carritoService.quitarItem(productoId);
  }
}
