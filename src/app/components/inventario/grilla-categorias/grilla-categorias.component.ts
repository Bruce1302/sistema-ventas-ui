import { Component, effect, inject, signal } from '@angular/core';
import { Categoria, CategoriaService } from '../../../services/categoria.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { ProductoService } from '../../../services/producto.service';
import { NgClass } from '@angular/common';
import { ConfirmacionService } from '../../../services/confirmacion.service';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  selector: 'app-grilla-categorias',
  styleUrl: './grilla-categorias.component.css',
  templateUrl: './grilla-categorias.component.html',
})
export class GrillaCategoriasComponent {

  private categoriaService = inject(CategoriaService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private productosService = inject(ProductoService);
  private confirmacionService = inject(ConfirmacionService);

  guardando = signal(false);

  paginaActualProductos = this.productosService.paginaActual;

  listaCategorias = this.categoriaService.categorias; //traemos las categorias

  formularios: Record<string, FormGroup> = {};
  editando: Record<string, boolean> = {};

  constructor() {
    // Este efecto vigila la lista de productos, si se cambia de pagina, reconstruye los formularios
    effect(() => {
      const categorias = this.listaCategorias()|| [];

      categorias.forEach(categoria => {
        // Creamos un formulario exclusivo usando el ID del producto como llave
        this.formularios[categoria.id] = this.fb.group({
          nombre: [categoria.nombre, Validators.required],
        });
        // Por defecto los cards se muestran con la edicion bloqueada
        this.editando[categoria.id] = false;
      });
    });
  }

  eliminarCategoria(categoria: Categoria)
  {
    //this.categoriaService.eliminarCategoria(id);
    this.confirmacionService.pedir(
      '¿Eliminar categoría?',
      `Se eliminará la categoria "${categoria.nombre}". Esta acción no se puede deshacer.`,
      () => this.categoriaService.eliminarCategoria(categoria.id)
    );
  }

  activarEdicion(id: string)
  {
    this.editando[id] = true;
  }

  cancelarEdicion(id: string)
  {
    this.editando[id] = false;
  }

  actualizarCategoria(id: string)
  {
    this.guardando.set(true);

    if (this.formularios[id].invalid)
      return;

    //obtenemos los datos editados del formulario
    const datosEditados = this.formularios[id].value;

    //lo enviamos al servicio
    this.categoriaService.actualizarCategoria(datosEditados, id).subscribe({
      next: () => {
        this.cancelarEdicion(id);
        this.categoriaService.obtenerCategorias();
        this.productosService.obtenerProductosPaginados(this.paginaActualProductos());
        this.toastService.mostrar('Categoria actualizada exitosamente', 'exito');
        this.guardando.set(false);
      },
      error: (error) => {
        console.error('Error al actualizar categoria:', error);
        this.guardando.set(false);
      }
    });
  }


}
