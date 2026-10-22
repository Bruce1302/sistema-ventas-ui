import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import {NgClass} from '@angular/common';

@Component({
  imports: [
    NgClass
  ],
  selector: 'app-grilla-productos',
  styleUrl: './grilla-productos.component.css',
  templateUrl: './grilla-productos.component.html',
})
export class GrillaProductosComponent implements OnInit{

  ngOnInit()
  {
    this.cambiarPagina(this.paginaActual());
  }

  private productoService = inject(ProductoService);
  paginaActual = signal(0);

  productosPaginados = this.productoService.productosPaginados;

  cambiarPagina(nuevaPagina: number)
  {
    this.paginaActual.set(nuevaPagina);

    //le pasamos el bloque de ventas que necesitamos
    this.productoService.obtenerProductosPaginados(nuevaPagina);
  }

  eliminarProducto(id: string)
  {
    this.productoService.eliminarProducto(id);
  }

}
