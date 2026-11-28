import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import {NgClass} from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../productos/productos.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { ConfirmacionService } from '../../../services/confirmacion.service';

@Component({
  imports: [
    NgClass,
    ReactiveFormsModule,
  ],
  selector: 'app-grilla-productos',
  styleUrl: './grilla-productos.component.css',
  templateUrl: './grilla-productos.component.html',
})
export class GrillaProductosComponent implements OnInit {

  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private toastService = inject(ToastService);
  private confirmacionService = inject(ConfirmacionService);
  private fb = inject(FormBuilder);

  guardando = signal(false);

  listaCategorias = this.categoriaService.categorias;

  paginaActual = signal(0);

  productosPaginados = this.productoService.productosPaginados;

  terminoBusqueda = this.productoService.terminoBusqueda;

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

  eliminarProducto(producto: Producto)
  {
    //this.productoService.eliminarProducto(id);
    this.confirmacionService.pedir(
      '¿Eliminar producto?',
      `Se eliminará "${producto.nombre}". Esta acción no se puede deshacer.`,
      () => this.productoService.eliminarProducto(producto.id)
    );
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
          codigo: [producto.codigo, [Validators.required, Validators.min(0)]],
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
    this.guardando.set(true);
    if (this.formularios[id].invalid)
      return;

    //obtenemos los datos editados del formulario
    const datosEditados = this.formularios[id].value;

    //lo enviamos al servicio
    this.productoService.actualizarProducto(datosEditados, id).subscribe({
      next: () => {
        this.cancelarEdicion(id);
        this.productoService.obtenerProductosPaginados(this.paginaActual());
        this.toastService.mostrar('Producto actualizado exitosamente', 'exito');
        this.guardando.set(false);

      },
      error: (error) => {
        const mensaje = error.error?.error || 'Ocurrió un error al actualizar el producto.';
        console.error('Error al actualizar el producto:', error);
        this.toastService.mostrar(mensaje, 'error');
        this.guardando.set(false);
      }
    });
  }
}

