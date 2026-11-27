import { inject, Injectable, Injector, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequestDTO } from '../components/login/login.component';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { TiendaService } from './tienda.service';

@Injectable({
  providedIn: 'root' // servicio disponible para toda la aplicación
})
export class AuthService {

  //Direccion del API
  private apiUrl = `${environment.apiUrl}/auth/login`;

  //Declaramos el rol como signal para evitar que se haga la decodificacion muchas veces por segundo
  usuarioRol = signal<string | null>(null);
  tiendaId = signal<string | null>(null);

  private http = inject(HttpClient)
  private router = inject(Router)
  private injector = inject(Injector);

  constructor()
  {
    this.obtenerRolLogueado(); //Obtenemos el rol del usuario logueado al iniciar la app
  }

  iniciarSesion(credenciales: AuthRequestDTO)
  {
    //Realizamos la consulta al API enviando las credenciales
    return this.http.post(this.apiUrl, credenciales);

  }

  cerrarSesion()
  {
    localStorage.removeItem('token');
    this.usuarioRol.set(null);
    this.tiendaId.set(null);

    // Pedimos TiendaService bajo demanda justo al cerrar sesión (cero dependencia circular)
    const tiendaService = this.injector.get(TiendaService);
    tiendaService.tiendaActual.set(null);

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

  obtenerTiendaIdLogueada()
  {
    const payload = this.decoficarToken();
    this.tiendaId.set(payload?.tiendaId || null);
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

  estaAutenticado(): boolean
  {
    const payload = this.decoficarToken();
    if (!payload || !payload.exp) {
      return false;
    }

    // payload.exp viene en segundos, multiplicamos por 1000 para comparar en milisegundos
    const fechaExpiracion = payload.exp * 1000;
    const estaVigente = Date.now() < fechaExpiracion;

    if (!estaVigente)
    {
      // Si ya caducó, limpiamos el token muerto de inmediato para que vuelva a iniciar sesión
      localStorage.removeItem('token');
      this.usuarioRol.set(null);
      this.tiendaId.set(null);
    }

    return estaVigente;
  }
}
