import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


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
  constructor(private authService: AuthService) {}

  iniciarSesion()
  {
    console.log('Iniciando sesión con los datos... \n', this.credenciales);

    //Enviamos la peticion y esperamos la respuesta
    this.authService.iniciarSesion(this.credenciales).subscribe({
      next: (respuesta) =>
      {
        console.log('Respuesta del servidor: ', respuesta);
      },
      error: (error) =>
      {
        console.log('Error en la peticion: ', error);
      }
    });

  }
}
