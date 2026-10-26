import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductoService} from '../../../services/producto.service';
import {CategoriaService} from '../../../services/categoria.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    imports: [
        ReactiveFormsModule
    ],
  selector: 'app-form-producto',
  styleUrl: './form-producto.component.css',
  templateUrl: './form-producto.component.html',
})
export class FormProductoComponent  implements OnInit{

  private toastService = inject(ToastService);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

  private fb = inject(FormBuilder);

  ngOnInit()
  {
    this.categoriaService.obtenerCategorias();
  }

  listaCategorias = this.categoriaService.categorias; //traemos las categorias

  // creamos el molde del formulario reactivo
  productoForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    categoriaId: ['', Validators.required],
    precio: ['', Validators.required],
    stock: ['', Validators.required]
  });

  agregarProducto()
  {
    if (this.productoForm.valid)
    {
      this.productoService.agregarProducto(this.productoForm.value).subscribe({
        next: () =>
        {
          console.log('Producto agregado');
          this.productoForm.reset();
          this.productoService.paginaActual.set(0);
          this.productoService.obtenerProductosPaginados(0);
          this.toastService.mostrar('Producto agregado exitosamente', 'exito');


        },
        error: (error) =>
        {
          console.error('Error al agregar producto:', error);
          this.toastService.mostrar('Ocurrió un error', 'error');
        }

      });
    }
  }

}
