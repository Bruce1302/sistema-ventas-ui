import { Component, effect, inject } from '@angular/core';
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

  usuarioEnEdicion = this.usuarioService.usuarioSeleccionado;

  // creamos le molde del formulario reactivo
  usuarioForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rol: ['CAJERO', Validators.required] // CAJERO como opción por defecto
  });

  constructor()
  {
    effect(() => {
      const usuario = this.usuarioEnEdicion();

      if (usuario) {
        // Llenamos las cajas con los datos (dejamos password en blanco por seguridad)
        this.usuarioForm.patchValue({
          username: usuario.username,
          rol: usuario.rol,
          password: ''
        });

        // Quitamos la obligatoriedad de la contraseña inmediatamente
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('password')?.updateValueAndValidity();
      }
      else
        this.usuarioForm.reset({ rol: 'CAJERO' });

    });
  }

  cancelarEdicion() {
    // Al vaciar el signal, el effect() se dispara solo y limpia el formulario
    this.usuarioService.usuarioSeleccionado.set(null);
    this.usuarioForm.reset({ rol: 'CAJERO' });

    // Volvemos a exigir la contraseña para crear usuarios nuevos
    this.usuarioForm.get('password')?.setValidators([Validators.required]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

  guardarUsuario()
  {
    if (this.usuarioForm.valid)
    {

      if (this.usuarioService.usuarioSeleccionado())  // si es distinto de null significa que se requiere editar
      {

        console.log('Nuevos datos:', this.usuarioForm.value);

        //Creamos el usuario para editar
        const usuarioEditado =
          {
            id: this.usuarioService.usuarioSeleccionado()?.id || '',
            username: this.usuarioForm.value.username,
            password: this.usuarioForm.value.password,
            rol: this.usuarioForm.value.rol
          };

        //Mandamos a editar el usuario
        this.usuarioService.editarUsuario(usuarioEditado).subscribe({
          next: (usuarioActualizado) =>
          {
            this.usuarioService.obtenerUsuarios();

            console.log('Usuario actualizado exitosamente');
            this.cancelarEdicion();
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
            this.usuarioService.obtenerUsuarios();
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


}
