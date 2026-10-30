import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Producto} from '../../productos/productos.component';
import {ProductoService} from '../../../services/producto.service';
import {PageResponse} from '../../../models/pagination.model';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
    imports: [
        ReactiveFormsModule
    ],
  selector: 'app-barra-buscar',
  styleUrl: './barra-buscar.component.css',
  templateUrl: './barra-buscar.component.html',
})
export class BarraBuscarComponent implements OnInit {

  buscador = new FormControl('');
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  listaCategorias = this.categoriaService.categorias;

  menuAbierto: boolean = false;

  //productosPaginados = this.productoService.productosPaginados;

  ngOnInit()
  {
    this.buscarProductos();

    //Llamamos a las categorias
    this.categoriaService.obtenerCategorias();
  }

  //Abrimos y cerramos el menu de filtros
  toggleFiltros()
  {
    this.menuAbierto = !this.menuAbierto;
  }

  buscarProductos()
  {
    this.buscador.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
    ).subscribe((texto) => {

    if (!texto || texto.trim() === '')
    {
      this.productoService.obtenerProductosPaginados(0);
      return;
    }

    this.productoService.buscarProductos(texto).subscribe({
      next: (respuesta) => {
        // En el Inventario guardamos la página entera (content + metadata de paginación)
        this.productoService.productosPaginados.set(respuesta);
      },
      error: (error) => console.error('Error en la búsqueda del Inventario:', error)
    });
  });
  }
}
