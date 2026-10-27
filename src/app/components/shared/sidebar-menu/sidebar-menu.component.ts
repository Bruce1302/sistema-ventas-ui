import {Component, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
    imports: [
        RouterLink,
      RouterLinkActive
    ],
  selector: 'app-sidebar-menu',
  styleUrl: './sidebar-menu.component.css',
  templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent {

  private auth = inject(AuthService);
  rolUsuario = this.auth.usuarioRol; //Obtenemos el rol del usuario logueado

  cerrarSesion()
  {
    this.auth.cerrarSesion();
  }
}
