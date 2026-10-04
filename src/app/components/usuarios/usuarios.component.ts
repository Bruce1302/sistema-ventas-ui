import {Component, inject, OnInit} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';


@Component({
  imports: [],
  selector: 'app-usuarios',
  styleUrl: './usuarios.component.css',
  templateUrl: './usuarios.component.html',
})

export class UsuariosComponent implements OnInit{

  usuarioService = inject(UsuarioService);
  usuarios = this.usuarioService.usuarios


  ngOnInit()
  {
    this.usuarioService.obtenerUsuarios();
  }

  eliminarUsuario(id: string)
  {
    this.usuarioService.eliminarUsuario(id);
  }

}
