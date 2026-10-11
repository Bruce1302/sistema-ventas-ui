import {Component, inject, OnInit, signal} from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import {CarritoService} from '../../services/carrito.service';
import {NgClass} from '@angular/common';

export interface Producto
{
  id: string;
  nombre: string;
  categoriaId: string;
  categoriaNombre: string;
  precio: number;
  stock: number;

}

@Component({
  imports: [
    NgClass
  ],
  standalone: true,
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})

  export class ProductosComponent implements OnInit{

  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  topProductos = this.productoService.topProductos; //enlazamos el signal


  ngOnInit()
  {
    this.productoService.obtenerTopProductos();
  }

  agregarAlCarrito(producto: Producto)
  {
    this.carritoService.agregarItem(producto);
  }


}
