import {inject, Injectable, Service, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Usuario
{
  id: string;
  username: string;
  rol: string;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class UsuarioService {

  usuarios = signal<Usuario[]>([]);

  private apiUrl = 'http://localhost:8080/usuarios';

  private http = inject(HttpClient);

  obtenerUsuarios()
  {
    this.http.get<Usuario[]>(this.apiUrl).subscribe({

      next: (usuarios) =>
      {
        this.usuarios.set(usuarios);
      },
      error: (error) =>
      {
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }

  eliminarUsuario(id: string)
  {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () =>
      {
        // Actualizamos la lista de usuarios eliminando el usuario con el id proporcionado
        this.usuarios.update(usuarios => usuarios.filter(usuario => usuario.id !== id));
      },
      error: (error) =>
      {
        console.error('Error al eliminar el usuario:', error);
      }
    });
  }

    agregarUsuario(usuario: {username: string, password: string, rol: string})
    {
      return this.http.post<Usuario>(this.apiUrl, usuario);
    }
}
