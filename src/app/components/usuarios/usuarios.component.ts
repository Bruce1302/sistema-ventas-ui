import {Component, inject, OnInit} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
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

  guardarUsuario()
  {
    if (this.usuarioForm.valid)
    {
      this.usuarioService.agregarUsuario(this.usuarioForm.value).subscribe({
        next: (nuevoUsuario) => {
          // Actualizamos el Signal reactivo del servicio con el nuevo usuario
          this.usuarioService.usuarios.update(usuarios => [...usuarios, nuevoUsuario]);

          // Limpiamos el formulario SOLO si el backend confirmó el éxito
          this.usuarioForm.reset({rol: 'CAJERO'});
          console.log('Usuario guardado exitosamente');
        },
        error: (error) => {
          console.error('Error al agregar el usuario:', error);
          // Aquí podrías mostrar una alerta roja sin borrar lo que el usuario escribió
        }
      });

    }
    else
    {
      console.log('El formulario es inválido o está incompleto');
    }
  }

}
