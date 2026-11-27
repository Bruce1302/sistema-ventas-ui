import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  // Buscamos el token en el localStorage
  const token = localStorage.getItem('token');

  const authService = inject(AuthService);

  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend rechaza el token por vencido o inválido (ignorando el intento de login)
      if ((error.status === 401 || error.status === 403) && !req.url.includes('/auth/login'))
        authService.cerrarSesion(); // Limpia token, signals y redirige a /login

      return throwError(() => error);
    })
  );
};
