import { Component, effect, inject } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  selector: 'app-grilla-categorias',
  styleUrl: './grilla-categorias.component.css',
  templateUrl: './grilla-categorias.component.html',
})
export class GrillaCategoriasComponent {

  private categoriaService = inject(CategoriaService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

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

  eliminarCategoria(id: string)
  {
    this.categoriaService.eliminarCategoria(id);
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
    if (this.formularios[id].invalid)
      return;

    //obtenemos los datos editados del formulario
    const datosEditados = this.formularios[id].value;

    //lo enviamos al servicio
    this.categoriaService.actualizarCategoria(datosEditados, id).subscribe({
      next: () => {
        this.cancelarEdicion(id);
        this.categoriaService.obtenerCategorias();
        this.toastService.mostrar('Categoria actualizada exitosamente', 'exito');
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    });
  }


}
