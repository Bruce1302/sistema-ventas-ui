import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductosComponent } from '../productos/productos.component';
import {CarritoComponent} from '../carrito/carrito.component';

@Component({
  imports: [ProductosComponent, CarritoComponent, RouterLink],
  standalone: true,
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  // Variable para que el HTML pueda leerla
  nombreUsuario: string = '';

  private auth = inject(AuthService);
  rolUsuario = this.auth.usuarioRol; //Obtenemos el rol del usuario logueado

  // Este metodo se ejecuta apenas el componente nace en la pantalla
  ngOnInit() {
    const usuario = this.auth.obtenerUsernameLogueado(); //Obtenemos el usuario del token

    if (usuario)
      this.nombreUsuario = usuario; //Enviamos el username al html


  }

  cerrarSesion()
  {
    this.auth.cerrarSesion();
  }
}
