import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { TiendaService } from '../../services/tienda.service';
import { ToastService } from '../../services/toast.service';


//creamos la interfaz con los datos necesarios para el login
export interface AuthRequestDTO
{
  codigoTienda: string;
  username: string;
  password: string;
}

@Component({
  standalone: true,

  //Para manejar formularios
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})

export class LoginComponent {

  credenciales: AuthRequestDTO = { username: '',password: '', codigoTienda: ''};

  // Inyectamos el servicio
  constructor(private authService: AuthService, private router: Router, private tiendaService: TiendaService, private toastService: ToastService) {}

  iniciarSesion()
  {
    //Enviamos la peticion y esperamos la respuesta
    this.authService.iniciarSesion(this.credenciales).subscribe({
      next: (respuesta: any) =>
      {
        console.log('Respuesta del servidor: ', respuesta);

        //Guardamos el token y la tienda
        localStorage.setItem('token', respuesta.token);
        this.authService.obtenerRolLogueado();
        this.authService.obtenerTiendaIdLogueada();

        const id = this.authService.tiendaId();
        if (id)
        {
          this.tiendaService.cargarTienda(id);
          console.log('facturacion activa: ' + this.tiendaService.tiendaActual()?.facturacionActiva);
        }

        console.log('Tienda cargada: ' + id);

        this.router.navigate(['/home']);
      },
      error: (error) =>
      {
        console.log('Error al iniciar sesion: ', error);
        this.toastService.mostrar('El usuario o contraseña son invalidos.', 'error');
      }
    });

  }
}
