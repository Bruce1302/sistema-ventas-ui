import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../productos/productos.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Categoria, CategoriaService} from '../../services/categoria.service';
import {FormProductoComponent} from './form-producto/form-producto.component';
import { GrillaProductosComponent } from './grilla-productos/grilla-productos.component';

@Component({
  imports: [
    ReactiveFormsModule,
    FormProductoComponent,
    GrillaProductosComponent
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

  //creamos el formulario reactivo para agregar categorias
  categoriaForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required]
  });

  ngOnInit()
  {
    this.categoriaService.obtenerCategorias();
    this.cambiarPagina(this.paginaActual());
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

  agregarCategoria()
  {
    if(this.categoriaForm.valid)
    {
      this.categoriaService.agregarCategorias(this.categoriaForm.value).subscribe({
      next: (categoria: Categoria) =>
      {
        console.log('Categoria agregada');
        this.listaCategorias.update(categoriasActuales => [...categoriasActuales, categoria]); // Agregamos la nueva categoría a la lista
      },
      error: (error) =>
      {
        console.error('Error al agregar categoria:', error);
      }

      });
    }
  }

  eliminarCategoria(id: string)
  {
    this.categoriaService.eliminarCategoria(id);
  }


}
