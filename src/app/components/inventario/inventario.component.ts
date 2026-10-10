import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../productos/productos.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  imports: [
    ReactiveFormsModule
  ],
  selector: 'app-inventario',
  styleUrl: './inventario.component.css',
  templateUrl: './inventario.component.html',
})
export class InventarioComponent implements OnInit{

  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

  productosPaginados = this.productoService.productosPaginados;
  listaCategorias = this.categoriaService.categorias; //traemos las categorias
  paginaActual = signal(0);

  private fb = inject(FormBuilder);

  // creamos el molde del formulario reactivo
  productoForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    categoriaId: ['', Validators.required],
    precio: ['', Validators.required],
    stock: ['', Validators.required]
  });

  ngOnInit()
  {
    this.categoriaService.obtenerCategorias();
    this.cambiarPagina(this.paginaActual());
  }

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

  //cuando se requieran ver mas productos
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
