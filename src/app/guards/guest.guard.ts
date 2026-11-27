import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');
  const authService = inject(AuthService);

  if (authService.estaAutenticado())
  {
    router.navigate(['/home']);
    return false; // Bloqueamos que se dibuje la pantalla de login
  }
  else     // Si no existe un token, permitimos acceso al login
      return true;

};
