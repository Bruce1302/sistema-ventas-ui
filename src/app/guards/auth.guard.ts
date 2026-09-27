import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  // Inyectamos el enrutador
  const router = inject(Router);

  // Buscamos el token en el local storage
  const token = localStorage.getItem('token');

  if (token)
    return true;
  else // Si no hay token, lo mandamos de vuelta al login
  {
    router.navigate(['/login']);
    return false; // Bloqueamos la carga de la página
  }

};
