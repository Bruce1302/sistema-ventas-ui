import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequestDTO } from '../components/login/login.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // servicio disponible para toda la aplicación
})
export class AuthService {

  //Direccion del API
  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient, private router: Router) { }


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
    const token = localStorage.getItem('token');

    //Si no hay token
    if(!token)
      return null;

    try
    {
      //El token tiene 3 partes separadas por un punto '.'. El Payload es la segunda parte (índice 1).
      const payloadBase64 = token.split('.')[1];

      // Decodificamos a texto plano
      const payloadDecodificado = atob(payloadBase64);

      //Convertimos ese texto a un Json
      const payloadJson = JSON.parse(payloadDecodificado);

      // Retornamos el subject que es la variable donde se guarda tu username
      return payloadJson.sub;
    }
    catch (error)
    {
      console.error("Error al decodificar el token", error);
      return null;
    }
  }
}
