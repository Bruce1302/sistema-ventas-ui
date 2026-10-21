import {Component, inject, OnInit, signal} from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Router, RouterLink } from '@angular/router';
import {CarritoService} from '../../services/carrito.service';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {PageResponse} from '../../models/pagination.model';

export interface Producto
{
  id: string;
  nombre: string;
  categoriaId: string;
  categoriaNombre: string;
  precio: number;
  stock: number;

}

@Component({
  imports: [
    NgClass,
    ReactiveFormsModule,
    RouterLink,
    DecimalPipe
  ],
  standalone: true,
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})

  export class ProductosComponent implements OnInit{

  buscador = new FormControl('');

  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  topProductos = this.productoService.topProductos; //enlazamos el signal


  ngOnInit()
  {
    this.productoService.obtenerTopProductos();

    this.buscarProductos();
  }

  agregarAlCarrito(producto: Producto, cantidad: string)
  {
    let cantidadSeleccionada = parseInt(cantidad);

    //Si la cantidad no es un número entonces aumaticamente se convertira en un 1
    if (isNaN(cantidadSeleccionada) || cantidadSeleccionada < 1)
      cantidadSeleccionada = 1;

    //Si la cantidad seleccionada es mayor al stock entonces se convierte en el stock
    if (cantidadSeleccionada > producto.stock)
      cantidadSeleccionada = producto.stock;

    this.carritoService.agregarItem(producto, cantidadSeleccionada);
  }

  buscarProductos() {
    this.buscador.valueChanges.pipe(
      debounceTime(200), // Espera 300 milisegundos despues de que el usuario deje de teclear
      distinctUntilChanged() // Solo busca si el texto es diferente a la última busqueda
    ).subscribe((textoIngresado) => {

      // Si el texto esta vacio, volvemos a mostrar el top de vendidos
      if (!textoIngresado || textoIngresado.trim() === '') {
        this.productoService.obtenerTopProductos();
        return;
      }

      // Si hay texto, lo buscamos
      this.productoService.buscarProductos(textoIngresado ?? '').subscribe({
        next: (coincidencias: PageResponse<Producto>) => {
          // El Signal cambia los cards automaticamente
          this.topProductos.set(coincidencias.content);
        },
        error: (error) => console.log('Error en     la búsqueda', error)
      });
    });
  }

}
