import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  // Inyectamos el enrutador
  const router = inject(Router);
  const authService = inject(AuthService);

  // Buscamos el token en el local storage
  const token = localStorage.getItem('token');

  if (authService.estaAutenticado())
    return true;
  else
  {
    router.navigate(['/login']);
    return false;
  }

};
