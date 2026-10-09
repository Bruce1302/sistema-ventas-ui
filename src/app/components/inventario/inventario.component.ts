import { Component, inject } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../productos/productos.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [
    ReactiveFormsModule
  ],
  selector: 'app-inventario',
  styleUrl: './inventario.component.css',
  templateUrl: './inventario.component.html',
})
export class InventarioComponent {

  private productoService = inject(ProductoService);
  listaProductos = this.productoService.productos; //traemos los productos

  private fb = inject(FormBuilder);

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
        },
        error: (error) =>
        {
          console.error('Error al agregar producto:', error);
        }

      });
    }
  }

  eliminarProducto(id: string)
  {
    this.productoService.eliminarProducto(id);
  }
}
