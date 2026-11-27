import { Component, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Router, RouterLink } from '@angular/router';
import {CarritoService} from '../../services/carrito.service';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {PageResponse} from '../../models/pagination.model';
import { ToastService } from '../../services/toast.service';

export interface Producto
{
  id: string;
  nombre: string;
  codigo: string;
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

  @ViewChild('inputBuscador') inputBuscador!: ElementRef<HTMLInputElement>;
  buscador = new FormControl('');

  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private toastService = inject(ToastService);

  topProductos = this.productoService.topProductos; //enlazamos el signal

  @HostListener('document:keydown', ['$event'])
  onKeyDownGlobal(event: KeyboardEvent) {
    const elementoActivo = document.activeElement as HTMLElement;

    //Si el foco ya esta en este buscador o en otro input no interferimos
    if (elementoActivo === this.inputBuscador?.nativeElement || ['INPUT', 'TEXTAREA', 'SELECT'].includes(elementoActivo?.tagName))
      return;

    // Ignoramos teclas de control Ctrl, Alt, F1-F12, Tab, Escape, flechas, etc
    if (event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1)
      return;

    // si se presiona una letra o número suelto en la pantalla, enfocamos el buscador al instante si hacerle click
    this.inputBuscador?.nativeElement.focus();
  }


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

  alPresionarEnter() {
    const texto = this.buscador.value?.trim() ?? '';
    if (!texto) return;

    const resultadosActuales = this.topProductos();

    // si ya había 1 producto en pantalla
    if (resultadosActuales.length === 1)
    {
      this.agregarYLimpiar(resultadosActuales[0]);
      return;
    }

    // si la pistola escaneó tan rápido que el debounceTime aún no disparaba la búsqueda
    this.productoService.buscarProductos(texto).subscribe({
      next: (respuesta) =>
      {
        const coincidencias = respuesta.content;
        this.topProductos.set(coincidencias);

        // Si el código de barras devolvio exactamente 1 producto, lo agregamos al instante
        if (coincidencias.length === 1)
          this.agregarYLimpiar(coincidencias[0]);

      },
      error: (err) => console.error('Error al escanear producto:', 'error')
    });
  }

  private agregarYLimpiar(producto: Producto)
  {
    if (producto.stock > 0)
    {
      this.carritoService.agregarItem(producto, 1);
      // Al limpiar, el valueChanges detecta texto vacío y restaura el Top 15 automáticamente
      this.buscador.setValue('');
    }
    else
    {
      this.toastService.mostrar(`"${producto.nombre}" no tiene stock disponible.`, 'error');
      this.buscador.setValue('');
    }
  }

}
