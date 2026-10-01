import {inject, Injectable, Service, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequestDTO } from '../components/login/login.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // servicio disponible para toda la aplicación
})
export class AuthService {

  //Direccion del API
  private apiUrl = 'http://localhost:8080/auth/login';

  //Declaramos el rol como signal para evitar que se haga la decodificacion muchas veces por segundo
  usuarioRol = signal<string | null>(null);

  private http = inject(HttpClient)
  private router = inject(Router)

  constructor()
  {
    this.obtenerRolLogueado(); //Obtenemos el rol del usuario logueado al iniciar la app
  }

  iniciarSesion(credenciales: AuthRequestDTO)
  {
    //Realizamos la consulta al API enviando las credenciales
    return this.http.post(this.apiUrl, credenciales);

  }

  cerrarSesion( )
  {
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  obtenerUsernameLogueado()
  {
    const payload = this.decoficarToken();
    // El operador "?" verifica si payload es null antes de buscar el subject
    return payload?.sub || null;
  }

  obtenerRolLogueado()
  {
    const payload = this.decoficarToken();
    this.usuarioRol.set(payload?.rol || null); //guardamos el rol en el signal una sola vez
  }

  decoficarToken()
  {
    const token = localStorage.getItem('token');

    //Si no hay token
    if(!token)
      return null;

    try {
      //El token tiene 3 partes separadas por un punto '.'. El Payload es la segunda parte (índice 1).
      const payloadBase64 = token.split('.')[1];

      // Decodificamos a texto plano
      const payloadDecodificado = atob(payloadBase64);

      //Convertimos ese texto a un Json
      const payloadJson = JSON.parse(payloadDecodificado);

      return payloadJson;
    }
    catch (error)
    {
      console.error("Error al decodificar el token", error);
      return null;
    }
  }
}
