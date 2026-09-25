import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequestDTO } from '../components/login/login.component';

@Injectable({
  providedIn: 'root' // servicio disponible para toda la aplicación
})
export class AuthService {

  //Direccion del API
  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) { }

  iniciarSesion(credenciales: AuthRequestDTO)
  {
    //Realizamos la consulta al API enviando las credenciales
    return this.http.post(this.apiUrl, credenciales);

  }
}
