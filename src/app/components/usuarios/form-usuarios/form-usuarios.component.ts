import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario, UsuarioService } from '../../../services/usuario.service';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  selector: 'app-form-usuarios',
  styleUrl: './form-usuarios.component.css',
  templateUrl: './form-usuarios.component.html',
})
export class FormUsuariosComponent {

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

  guardarUsuario()
  {
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
          next: (nuevoUsuario) =>
          {
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

  cancelarEdicion()
  {
    this.usuarioSeleccionadoId = null;
    this.usuarioForm.reset({ rol: 'CAJERO' });

    // Volvemos a exigir la contraseña para crear usuarios nuevos
    this.usuarioForm.get('password')?.setValidators([Validators.required]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

}
