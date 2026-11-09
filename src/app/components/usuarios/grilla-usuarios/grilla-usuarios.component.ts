import { Component, inject, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../../../services/usuario.service';
import { Validators } from '@angular/forms';

@Component({
  imports: [],
  selector: 'app-grilla-usuarios',
  styleUrl: './grilla-usuarios.component.css',
  templateUrl: './grilla-usuarios.component.html',
})
export class GrillaUsuariosComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  usuarios = this.usuarioService.usuarios; // El signal con la lista de usuarios

  ngOnInit()
  {
    this.usuarioService.obtenerUsuarios();
  }

  seleccionarParaEdicion(usuario: Usuario)
  {
    // enviamos el usuario seleccionado para editar
    this.usuarioService.usuarioSeleccionado.set(usuario);
  }

  destruirUsuario(id: string)
  {
    this.usuarioService.destruirUsuario(id);
  }

  suspenderUsuario(id: string)
  {
    this.usuarioService.suspenderUsuario(id);
  }


}
