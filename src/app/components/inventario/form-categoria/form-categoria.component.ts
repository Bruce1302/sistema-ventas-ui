import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria, CategoriaService } from '../../../services/categoria.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  imports: [
    ReactiveFormsModule
  ],
  selector: 'app-form-categoria',
  styleUrl: './form-categoria.component.css',
  templateUrl: './form-categoria.component.html',
})
export class FormCategoriaComponent implements OnInit{

  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private toastService = inject(ToastService);

  listaCategorias = this.categoriaService.categorias; //traemos las categorias

  //creamos el formulario reactivo para agregar categorias
  categoriaForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required]
  });

  ngOnInit()
  {
    this.categoriaService.obtenerCategorias();
  }

  agregarCategoria()
  {
    if(this.categoriaForm.valid)
    {
      this.categoriaService.agregarCategorias(this.categoriaForm.value).subscribe({
        next: (categoria: Categoria) =>
        {
          console.log('Categoria agregada');
          this.categoriaForm.reset();
          this.listaCategorias.update(categoriasActuales => [...categoriasActuales, categoria]); // Agregamos la nueva categoría a la lista
          this.toastService.mostrar('Categoria agregada con éxito', 'exito');
        },
        error: (error) =>
        {
          console.error('Error al agregar categoria:', error);
        }

      });
    }
  }

}
