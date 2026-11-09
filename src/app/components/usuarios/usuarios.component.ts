import {Component, inject, OnInit} from '@angular/core';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SidebarMenuComponent} from '../shared/sidebar-menu/sidebar-menu.component';
import { FormUsuariosComponent } from './form-usuarios/form-usuarios.component';
import { GrillaUsuariosComponent } from './grilla-usuarios/grilla-usuarios.component';


@Component({
  imports: [ReactiveFormsModule, SidebarMenuComponent, FormUsuariosComponent, GrillaUsuariosComponent],
  selector: 'app-usuarios',
  styleUrl: './usuarios.component.css',
  templateUrl: './usuarios.component.html',
})

export class UsuariosComponent {

}
