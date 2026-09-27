import {Component, OnInit, signal} from '@angular/core';
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

export class ProductosComponent implements OnInit{

  constructor(private productoService: ProductoService, private router: Router) {  }

  listaProductos = signal<Producto[]>([]);

  ngOnInit()
  {
    this.obtenerProductos();
  }

  obtenerProductos()
  {
    this.productoService.obtenerProductos().subscribe({
      //Lo que nos retorna el api no es un array, es un objeto paginado
      next: (respuesta: any) =>
      {
        //Extraemos lo que lleva dentro del content
        this.listaProductos.set(respuesta.content);
        console.log('productos cargados con exito:', this.listaProductos);
      },
      error: (error) =>
      {
        console.log('No se pudieron obtener los productos', error);
      }
    })
  }
}
