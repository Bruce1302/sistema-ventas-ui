import { Component, inject, OnInit, signal } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SidebarMenuComponent } from '../shared/sidebar-menu/sidebar-menu.component';
import { GrillaCategoriasComponent } from '../inventario/grilla-categorias/grilla-categorias.component';
import { GrillaVentasComponent } from './grilla-ventas/grilla-ventas.component';

@Component({
  imports: [
    SidebarMenuComponent,
    GrillaVentasComponent
  ],
  selector: 'app-ventas',
  styleUrl: './ventas.component.css',
  templateUrl: './ventas.component.html',
})
export class VentasComponent {

}
