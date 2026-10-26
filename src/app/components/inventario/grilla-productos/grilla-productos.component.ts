import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import {NgClass} from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../productos/productos.component';
import { RouterLink } from '@angular/router';

@Component({
  imports: [
    NgClass,
    ReactiveFormsModule,
    //RouterLink
  ],
  selector: 'app-grilla-productos',
  styleUrl: './grilla-productos.component.css',
  templateUrl: './grilla-productos.component.html',
})
export class GrillaProductosComponent implements OnInit {

  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  listaCategorias = this.categoriaService.categorias;

  paginaActual = signal(0);

  productosPaginados = this.productoService.productosPaginados;

  //para poder editar los productos crearmeos un formulario para cada producto
  formularios: Record<string, FormGroup> = {};

  //para saber que producto se esta editando
  editando: Record<string, boolean> = {};

  ngOnInit() {
    this.cambiarPagina(this.paginaActual());
    this.categoriaService.obtenerCategorias();
  }

  cambiarPagina(nuevaPagina: number) {
    this.paginaActual.set(nuevaPagina);

    //le pasamos el bloque de ventas que necesitamos
    this.productoService.obtenerProductosPaginados(nuevaPagina);
  }

  eliminarProducto(id: string) {
    this.productoService.eliminarProducto(id);
  }

  constructor() {
    // Este efecto vigila la lista de productos, si se cambia de pagina, reconstruye los formularios
    effect(() => {
      const productos = this.productosPaginados()?.content || [];

      productos.forEach(producto => {
        // Creamos un formulario exclusivo usando el ID del producto como llave
        this.formularios[producto.id] = this.fb.group({
          nombre: [producto.nombre, Validators.required],
          categoriaId: [producto.categoriaId, Validators.required],
          precio: [producto.precio, [Validators.required, Validators.min(0)]],
          stock: [producto.stock, [Validators.required, Validators.min(0)]]
        });

        // Por defecto los cards se muestran con la edicion bloqueada
        this.editando[producto.id] = false;
      });
    });
  }

  activarEdicion(id: string)
  {
    this.editando[id] = true;
  }

  cancelarEdicion(id: string)
  {
    this.editando[id] = false;
  }

  actualizarProducto( id: string)
  {
    if (this.formularios[id].invalid)
      return;

    //obtenemos los datos editados del formulario
    const datosEditados = this.formularios[id].value;

    //lo enviamos al servicio
    this.productoService.actualizarProducto(datosEditados, id).subscribe({
      next: () => {
        this.cancelarEdicion(id);
        this.productoService.obtenerProductosPaginados(this.paginaActual());
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    });
  }
}

