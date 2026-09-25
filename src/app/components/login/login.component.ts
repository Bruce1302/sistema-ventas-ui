import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';


//creamos la interfaz con los datos necesarios para el login
export interface AuthRequestDTO
{
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

  credenciales: AuthRequestDTO = { username: '',password: '' };

  // Inyectamos el servicio
  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion()
  {
    //Enviamos la peticion y esperamos la respuesta
    this.authService.iniciarSesion(this.credenciales).subscribe({
      next: (respuesta: any) =>
      {
        console.log('Respuesta del servidor: ', respuesta);

        //Guardamos el token
        localStorage.setItem('token', respuesta.token);

        this.router.navigate(['/home']);
      },
      error: (error) =>
      {
        console.log('Error al iniciar sesion: ', error);
        alert('Credenciales invalidas');
      }
    });

  }
}
