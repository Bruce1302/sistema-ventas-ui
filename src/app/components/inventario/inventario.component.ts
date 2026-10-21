import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../productos/productos.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Categoria, CategoriaService} from '../../services/categoria.service';
import {FormProductoComponent} from './form-producto/form-producto.component';
import { GrillaProductosComponent } from './grilla-productos/grilla-productos.component';
import { FormCategoriaComponent } from './form-categoria/form-categoria.component';
import {SidebarMenuComponent} from '../shared/sidebar-menu/sidebar-menu.component';
import { GrillaCategoriasComponent } from './grilla-categorias/grilla-categorias.component';
import {BarraBuscarComponent} from './barra-buscar/barra-buscar.component';

@Component({
  imports: [
    ReactiveFormsModule,
    FormProductoComponent,
    GrillaProductosComponent,
    FormCategoriaComponent,
    SidebarMenuComponent,
    GrillaCategoriasComponent,
    BarraBuscarComponent
  ],
  selector: 'app-inventario',
  styleUrl: './inventario.component.css',
  templateUrl: './inventario.component.html',
})
export class InventarioComponent{


}
