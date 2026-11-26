import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { TiendaService } from '../../services/tienda.service';
import { ToastService } from '../../services/toast.service';
import { NgClass } from '@angular/common';


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
  imports: [FormsModule, NgClass, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})

export class LoginComponent {

  credenciales: AuthRequestDTO = { username: '',password: '', codigoTienda: ''};
  logueando = signal<boolean>(false);
  private fb = inject(FormBuilder);

  // Inyectamos el servicio
  constructor(private authService: AuthService, private router: Router, private tiendaService: TiendaService, private toastService: ToastService) {}

  loginForm: FormGroup = this.fb.group(
    {
      codigoTienda: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    }
  )

  iniciarSesion()
  {
    if (this.loginForm.invalid || this.logueando())
      return;

    this.logueando.set(true);

    //Enviamos la peticion y esperamos la respuesta
    this.credenciales = this.loginForm.getRawValue();
    this.authService.iniciarSesion(this.credenciales).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta del servidor: ', respuesta);

        //Guardamos el token y la tienda
        localStorage.setItem('token', respuesta.token);
        this.authService.obtenerRolLogueado();
        this.authService.obtenerTiendaIdLogueada();

        const id = this.authService.tiendaId();
        if (id) {
          this.tiendaService.cargarTienda(id);
          console.log('facturacion activa: ' + this.tiendaService.tiendaActual()?.facturacionActiva);
        }

        console.log('Tienda cargada: ' + id);

        this.router.navigate(['/home']);
        this.logueando.set(false);
      },
      error: (error) => {
        console.log('Error al iniciar sesion: ', error);
        this.toastService.mostrar('El usuario o contraseña son invalidos.', 'error');
        this.logueando.set(false);
      }
    });

  }
}
