import {inject, Injectable, Service, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Usuario
{
  id: string;
  username: string;
  rol: string;
  activo: boolean;
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
        console.log('Usuarios obtenidos con éxito ' + this.usuarios());
      },
      error: (error) =>
      {
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }

  suspenderUsuario(id: string)
  {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () =>
      {
        //Actualizamos la lista de usuarios inactivando el usuario con el id proporcionado
        this.usuarios.update(usuariosActuales =>
          usuariosActuales.map(usuario => {
            if (usuario.id === id) //buscamos al usuario y lo inactivamos
              return { ...usuario, activo: false };

            //si no es, lo devolvemos sin modificar
            return usuario;
          })
        );
        console.log('Usuario inactivado con éxito');

      },
      error: (error) =>
      {
        console.error('Error al eliminar el usuario:', error);
      }
    });
  }

  destruirUsuario(id: string)
  {
    this.http.delete(`${this.apiUrl}/${id}/hard`).subscribe({
      next: () =>
      {
        //eliminamos el usuario de la lista de usuarios
        this.usuarios.update(usuariosActuales =>
          usuariosActuales.filter(usuario => usuario.id !== id)
        );
        console.log('Usuario eliminado con exito');
      },
      error: (error) =>
      {
        console.error('Error al eliminar el usuario:', error);
      }
    })
  }

  agregarUsuario(usuario: {username: string, password: string, rol: string})
  {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  editarUsuario(usuario: { id: string, username: string, password: string, rol: string})
  {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }
}
