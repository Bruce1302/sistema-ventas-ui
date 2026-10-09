import { inject, Injectable, OnInit, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface categoria
{
  id: number;
  nombre: string;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CategoriaService
{
   categorias = signal(<categoria[]>([]));

   private apiUrl = 'http://localhost:8080/categorias';

   private http = inject(HttpClient);

   obtenerCategorias()
   {
     this.http.get<categoria[]>(this.apiUrl).subscribe({
       next: (data) =>
       {
         this.categorias.set(data);
       }
     });
   }


}
