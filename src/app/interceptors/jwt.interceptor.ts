import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  // Buscamos el token en el localStorage
  const token = localStorage.getItem('token');

  if (token) //Si el token existe
  {
    // clonamos la peticion y le ponemos la cabecera
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Dejamos que la peticion llegue al back
    return next(peticionClonada);
  }

  // Si no hay token la petición viaja normal
  return next(req);
};
