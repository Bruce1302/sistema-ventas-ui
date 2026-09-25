import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token)
  {
    // Si ya existe un token, lo mandamos directo al menú principal
    router.navigate(['/home']);
    return false; // Bloqueamos que se dibuje la pantalla de login
  }
  else     // Si no existe un token, permitimos acceso al login
      return true;

};
