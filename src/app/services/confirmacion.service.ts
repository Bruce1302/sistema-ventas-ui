import { Injectable, Service, signal } from '@angular/core';

export interface ConfirmacionData
{
  titulo: string;
  mensaje: string;
  alConfirmar: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmacionService {

  config = signal<ConfirmacionData | null>(null);

  pedir(titulo: string, mensaje: string, alConfirmar: () => void)
  {
    this.config.set({ titulo, mensaje, alConfirmar });
  }

  confirmar()
  {
    const actual = this.config();
    if (actual)
    {
      actual.alConfirmar(); // Ejecuta el borrado real
      this.config.set(null); // Cierra el modal
    }
  }

  cancelar()
  {
    this.config.set(null);
  }
}
