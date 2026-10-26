import {Injectable, Service, signal} from '@angular/core';

export interface ToastData
{
  mensaje: string;
  tipo: 'exito' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService
{
  //escuchara los cambios en el toastConfig y notificara a los componentes que lo esten usando
  toastConfig = signal<ToastData | null>(null);
  private temporizador: any;

  mostrar(mensaje: string, tipo: 'exito' | 'error' | 'info' = 'exito')
  {
    // Inyectamos los datos en el Signal
    this.toastConfig.set({ mensaje, tipo });

    // Si el usuario lanza otro toast muy rapido, reiniciamos el reloj
    if (this.temporizador) clearTimeout(this.temporizador);

    // desaparece el toast despues de 3 segundos
    this.temporizador = setTimeout(() => {
      this.toastConfig.set(null);
    }, 3000);
  }

  // Metodo para cerrar el toast manualmente
  cerrarToast()
  {
    this.toastConfig.set(null);
    if (this.temporizador) clearTimeout(this.temporizador);
  }

}
