import {Component, inject, OnInit, signal} from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import {CarritoService} from '../../services/carrito.service';

export interface Producto
{
  id: string;
  nombre: string;
  categoriaId: string;
  precio: number;
  stock: number;

}

@Component({
  imports: [],
  standalone: true,
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})

export class ProductosComponent implements OnInit{

  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  listaProductos = this.productoService.productos; //enlazamos el signal

  ngOnInit()
  {
    this.productoService.obtenerProductos();
  }

  agregarAlCarrito(producto: Producto)
  {
    this.carritoService.agregarItem(producto);
  }
}
