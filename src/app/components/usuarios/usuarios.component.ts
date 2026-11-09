import {Component, inject, OnInit} from '@angular/core';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SidebarMenuComponent} from '../shared/sidebar-menu/sidebar-menu.component';
import { FormUsuariosComponent } from './form-usuarios/form-usuarios.component';


@Component({
  imports: [ReactiveFormsModule, SidebarMenuComponent, FormUsuariosComponent],
  selector: 'app-usuarios',
  styleUrl: './usuarios.component.css',
  templateUrl: './usuarios.component.html',
})

export class UsuariosComponent implements OnInit{

  usuarioService = inject(UsuarioService);
  usuarios = this.usuarioService.usuarios

  private fb = inject(FormBuilder);

  // avisara al html para cambiar el titulo de acuerdo a la accion
  usuarioSeleccionadoId: string | null = null;

  // creamos le molde del formulario reactivo
  usuarioForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rol: ['CAJERO', Validators.required] // CAJERO como opción por defecto
  });

  ngOnInit()
  {
    this.usuarioService.obtenerUsuarios();
  }

  suspenderUsuario(id: string)
  {
    this.usuarioService.suspenderUsuario(id);
  }

  destruirUsuario(id: string)
  {
    this.usuarioService.destruirUsuario(id);
  }

  seleccionarUsuario(user: Usuario) {
    this.usuarioSeleccionadoId = user.id;

    // patchValue() inyecta los datos directamente en las cajas de texto que coincidan con los nombres
    this.usuarioForm.patchValue({
      username: user.username,
      rol: user.rol,
      password: '' // se deja la contraseña en blanco
    });

    //para poder mantener el campo de contraseña vacio y se actualice solo los campos cambiados, solo sucede al seleccionar la opcion de actualizar
    this.usuarioForm.get('password')?.clearValidators(); //quitamos la necesidad de validar el campo de contraseña
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

  cancelarEdicion()
  {
    this.usuarioSeleccionadoId = null;
    this.usuarioForm.reset({ rol: 'CAJERO' });

    // Volvemos a exigir la contraseña para crear usuarios nuevos
    this.usuarioForm.get('password')?.setValidators([Validators.required]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

}
