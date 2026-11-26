import { inject, Inject, Injectable, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Tienda
{
  id: string;
  codigo: string;
  nombre: string;
  direccion: string;
  telefono: string;
  facturacionActiva: boolean;
}

@Injectable({ providedIn: 'root' })
export class TiendaService {

  tiendaActual = signal<Tienda | null>(null);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/tiendas`;

  constructor() {
    // Se ejecuta 1 sola vez al arrancar la app incluso tras presionar F5 o actualizar
    this.authService.obtenerTiendaIdLogueada();

    const id = this.authService.tiendaId();

    if (id)
      this.cargarTienda(id);
  }

  cargarTienda(id: string)
  {
    this.http.get<Tienda>(`${this.apiUrl}/${id}`).subscribe({
      next: (tienda) =>
      {
        this.tiendaActual.set(tienda);
      },
      error: (error) =>
      {
        console.error('Error al cargar la tienda:', error);
      }
    });
  }

}
