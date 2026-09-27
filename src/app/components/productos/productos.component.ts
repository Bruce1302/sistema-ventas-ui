import { Component } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';

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

export class ProductosComponent {

  constructor(private productoService: ProductoService, private router: Router) {  }

  listaProductos: Producto[] = [];

  ngOnInit()
  {
    this.obtenerProductos();
  }

  obtenerProductos()
  {
    this.productoService.obtenerProductos().subscribe({
      next: (productos: Producto[]) =>
      {
        this.listaProductos = productos;
        console.log('Catálogo cargado con éxito:', this.listaProductos);
      },
      error(error)
      {
        console.log('No se pudieron obtener los productos', error);
      }
    })
  }
}
