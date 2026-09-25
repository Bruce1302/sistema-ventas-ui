import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {authGuard} from './guards/auth.guard';
import {guestGuard} from './guards/guest.guard';

export const routes: Routes = [

  // Si el usuario entra a la raíz, lo mandamos al login por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  //protegemos la ruta login
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },

  //protegemos la ruta home
  { path: 'home', component: HomeComponent, canActivate: [authGuard] }
];
