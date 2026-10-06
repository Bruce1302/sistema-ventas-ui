import {Component, inject, OnInit} from '@angular/core';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  imports: [ReactiveFormsModule],
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

  guardarUsuario() {
    if (this.usuarioForm.valid)
    {

      if (this.usuarioSeleccionadoId)  // si es distinto de null significa que se requiere editar
      {

        console.log('Nuevos datos:', this.usuarioForm.value);

        //Creamos el usuario para editar
        const usuarioEditado =
        {
          id: this.usuarioSeleccionadoId,
          username: this.usuarioForm.value.username,
          password: this.usuarioForm.value.password,
          rol: this.usuarioForm.value.rol
        };

        //Mandamos a editar el usuario
        this.usuarioService.editarUsuario(usuarioEditado).subscribe({
            next: (usuarioActualizado) =>
            {
              // actualizamos el signal
              this.usuarioService.usuarios.update(usuariosActuales =>
                usuariosActuales.map(usuario =>
                  // buscamos al usuario y actualizamos el array con el nuevo dato
                  usuario.id === this.usuarioSeleccionadoId ? usuarioActualizado : usuario
                )
              );

              console.log('Usuario actualizado exitosamente');
              this.cancelarEdicion(); // 4. Limpiamos el formulario y volvemos al modo "Registrar"
            },
            error: (error) =>
            {
              console.error('Error al editar el usuario:', error);
            }
          });

      }
      else //si es null significa que se requiere crear un nuevo usuario
      {
        this.usuarioService.agregarUsuario(this.usuarioForm.value).subscribe({
          next: (nuevoUsuario) => {
            this.usuarioService.usuarios.update(usuarios => [...usuarios, nuevoUsuario]);
            this.cancelarEdicion(); // Reutilizamos el mtodo cancelar para limpiar el formulario
            console.log('Usuario guardado exitosamente');
          },
          error: (error) => console.error('Error al agregar el usuario:', error)
        });
      }

    }
    else
    {
      console.log('El formulario es inválido o está incompleto');
    }
  }

  seleccionarUsuario(user: Usuario) {
    this.usuarioSeleccionadoId = user.id;

    // patchValue() inyecta los datos directamente en las cajas de texto que coincidan con los nombres
    this.usuarioForm.patchValue({
      username: user.username,
      rol: user.rol,
      password: '' // se deja la contraseña en blanco
    });
  }

  cancelarEdicion()
  {
    this.usuarioSeleccionadoId = null;
    this.usuarioForm.reset({ rol: 'CAJERO' });
  }

}
